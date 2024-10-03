import * as receiptline from "receiptline";
import {Printer} from "receiptline";
import {receiptMarkdownService} from "../markdown/ReceiptMarkdownService";
import {ReceiptPrintRequestDto} from "../markdown/ReceiptMarkdownInterface";
import * as process from "node:process";

const DefaultPrinter: Printer = {
    cpl: process.env.RECEIPT_PRINTER_CHARACTER_PER_LINE,
    encoding: process.env.RECEIPT_PRINTER_CHARACTER_ENCODING
} as Printer;

class ReceiptService {

    #toBase64 = (svg: string): string => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    createReceipt = (printDto: ReceiptPrintRequestDto): string => {
        const markdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(printDto)
        return this.#toBase64(receiptline.transform(markdown, DefaultPrinter));
    }

    createReceiptByMarkdown = (markdown: string): string => this.#toBase64(receiptline.transform(markdown, DefaultPrinter));
}

export const receiptService: ReceiptService = new ReceiptService();
