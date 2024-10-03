import {
    ReceiptCodeToFieldMap,
    ReceiptFieldCode,
    ReceiptFieldName,
    ReceiptTemplateLineDTO,
    ReceiptLineStyle,
    ReceiptTemplateDTO
} from "./receiptTemplateParser.interface";

const NEW_LINE: string = '~'
const HEADER1: string = '%IP';
const HEADER2: string = '%2H';
const CE: string = '%CE';
const OTHER_CONTROL_KEYS: string[] = ['%IFXT{', '%FI}', '%2X', '%T1', '$', ':', '='];
const KEYS_TO_CLEAR: string[] = [CE, ...OTHER_CONTROL_KEYS];
const ANY_2_LETTER_CODE_MATCHER: RegExp = /%[a-z0-9]{2}/gi; // %CE, %XP, %2H
const H1: string = 'h1';
const H2: string = 'h2';
const CENTER: string = 'center';
const TXT: string = 'text';
const LEFT: string = 'left';
const EMPTY: string = '';

const toReceiptLineDTO = (line: string): ReceiptTemplateLineDTO => {

    if(line.includes(HEADER1)) {
        const label: string = line.replace(ANY_2_LETTER_CODE_MATCHER, EMPTY).trim();
        if(!label) {
            return {label: EMPTY} as ReceiptTemplateLineDTO
        }
        return {label, style: H1, align: CENTER} as ReceiptTemplateLineDTO
    }

    const fieldCode: ReceiptFieldCode = Object.keys(ReceiptCodeToFieldMap).find(code => line.includes(code)) as ReceiptFieldCode;
    if(fieldCode) {
        const isH2 = line.includes(HEADER2);
        const label: string = line.replace(ANY_2_LETTER_CODE_MATCHER, EMPTY).trim();
        const field: ReceiptFieldName = ReceiptCodeToFieldMap[fieldCode];
        if(!label && !field) {
            return {label: EMPTY} as ReceiptTemplateLineDTO
        }
        if(field === 'cardholderName' as ReceiptFieldName) {
            return {label: EMPTY, field, fieldCode, style: TXT as ReceiptLineStyle, align: LEFT} as ReceiptTemplateLineDTO
        }
        return  {label, field, fieldCode, style: isH2 ? H2 : TXT as ReceiptLineStyle, align: isH2 ? CENTER : LEFT} as ReceiptTemplateLineDTO
    }

    if(line.includes(HEADER2)) {
        const label = line.replace(ANY_2_LETTER_CODE_MATCHER, EMPTY).trim();
        if(!label) {
            return {label: EMPTY} as ReceiptTemplateLineDTO
        }
        return {label, style: H2, align: CENTER} as ReceiptTemplateLineDTO
    }

    return {label: EMPTY} as ReceiptTemplateLineDTO
}

export const parseReceiptTemplate = (t: string): ReceiptTemplateDTO => {

    if(!t) {
        return [];
    }

    const _1stHeaderIndx: number = t.indexOf(HEADER1);
    if(_1stHeaderIndx > 0){
        t= t.substring(_1stHeaderIndx);
    }

    let lines: string[] = t.split(NEW_LINE);
    lines = lines.map((line: string) => {
        KEYS_TO_CLEAR.forEach(key => {
            line = line.replaceAll(key, EMPTY);
        })
        return line.trim();
    })

    return lines.map(toReceiptLineDTO).filter(nonEmptyReceiptTemplateDTO);
}

const nonEmptyReceiptTemplateDTO = (line: ReceiptTemplateLineDTO): boolean => !!(line.label || line.field);
