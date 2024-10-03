import {
    ReceiptTemplateLineDTO
} from "../../template/receiptTemplateParser.interface";
import {
    AlignCenterTextAutoWidthWrap,
    AlignLeftTextAutoWidthWrap,
    ColDelimiter,
    Colon,
    HH,
    Indent,
    Inverse,
    NewEmptyLine,
    NewLine,
    ReceiptPrintRequestDto,
    Space,
    SpaceX,
    WingPointsLogo
} from "./ReceiptMarkdownInterface";
import * as process from "node:process";

const cpl: number = +process.env.RECEIPT_PRINTER_CHARACTER_PER_LINE!;

class ReceiptMarkdownService {

    // Breakdowns words if (cpl - n) is exceeded
    #wordBreak = (txt: string, n: number = 3): string => {
        const words: string[] = txt?.split(' ').map(item => item.trim()).filter(item => item.length > 0) ?? [];
        let result: string = '';
        let lineCount: number = 1;
        words.forEach((word: string) => {
            const lineExceeded: boolean = (cpl - n)*lineCount < (result + word).length;
            lineCount += lineExceeded ? 1 : 0;
            result += ( lineExceeded ? (NewLine + Indent): '') + word + (lineExceeded ? ' ' : ' ');
        })
        return result;
    }

    #maskCardNumber = (printRequestDto: ReceiptPrintRequestDto): void => {
        let pin: string = printRequestDto.cardNumber ? (printRequestDto.cardNumber + '') : '';
        if(pin.length > 4) {
            printRequestDto.cardNumber = '############' + pin.substring(pin.length - 4);
        }
    }

    toWingPointsReceiptMarkDown = (printRequestDto: ReceiptPrintRequestDto): string => {

        this.#maskCardNumber(printRequestDto);

        const logo: string = `{image:${WingPointsLogo}}`;

        const {location, template } = printRequestDto;
        let markdown: string = logo + NewEmptyLine + location;
        let prevAlign: string = '';
        template?.forEach((l: ReceiptTemplateLineDTO) => {
            const formatterChanged = l.align != prevAlign;
            // check if new empty line is required
            if(!l.label && !l.align && !l.field) {
                markdown += NewEmptyLine;
            }

            const hasLabelButNoValue: boolean = !!l.label && !!l.field && !printRequestDto[l.field] && printRequestDto[l.field] !== 0;
            if(hasLabelButNoValue) {
                return;
            }

            // Add formatting: align left or center
            if(formatterChanged) {
                prevAlign = l.align ?? '';
                const formatting: string = (l.align === 'left' ? AlignLeftTextAutoWidthWrap : l.align === 'center' ? AlignCenterTextAutoWidthWrap : '');
                markdown += (formatting ? (NewEmptyLine + formatting + NewLine) : '');
            }

            // Indent better on left align
            if(l.align === 'left') {
                markdown += Indent;
            }

            // Handle h1 case: Inverse centered title
            if(l.label && l.style === 'h1') {
                const leftHandSpaces: number = Math.floor((cpl - l.label.length)/2);
                const rightHandSpaces: number = cpl - l.label.length - leftHandSpaces;
                markdown += ((formatterChanged ? '' : NewLine) + (Inverse + HH + SpaceX(leftHandSpaces) + l.label + SpaceX(rightHandSpaces) + HH));
            }

            // Handle filled fields with label e.g. Date and %DT
            if(l.label && l.field) {
                markdown += (l.label + Space + ColDelimiter + Colon + Space + printRequestDto[l.field] + Space + ColDelimiter) + NewLine;
            }

            // Handle filled fields without label e.g. Instant Prize Message
            if(!l.label && l.field && l.style === 'text') { // Following `left` control is used to align the text to the left, otherwise it will be centered.
                const fieldValue: string = this.#wordBreak(printRequestDto[l.field] + '');
                if(l.field === 'instantMessage') {
                    markdown += fieldValue + NewLine;
                } else {
                    markdown += (fieldValue + (l.align === 'left' ? Space + ColDelimiter : '') + NewLine);
                }
            }

            // Handle filled fields without label and with style h2 e.g. Current Balance Value
            if(!l.label && l.field && l.style === 'h2') { // Note: We could opt for printing bigger text since it's h2, but for now a centered one is fine from a UX point of view.
                markdown += ((printRequestDto[l.field]) + NewLine)
            }

            // Handle labels with empty field having style h2 e.g. Current Balance Label
            if(l.label && !l.field && l.style === 'h2') { // Note: We could opt for printing bigger text since it's h2, but for now a centered one is fine from a UX point of view.
                markdown += ((formatterChanged ? '' : NewLine) + l.label + NewLine)
            }
        })

        markdown += (NewEmptyLine + NewLine);

        return markdown;
    }
}

export const receiptMarkdownService: ReceiptMarkdownService = new ReceiptMarkdownService();
