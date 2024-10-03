import {expect} from "chai";
import {receiptMarkdownService} from "../../../../../src/loyalty/receipt/receiptline/markdown/ReceiptMarkdownService";
import {
    balancePrintRequestDto,
    issuePrintRequestDto,
    redeemPrintRequestDto
} from "./receipt.markdown.service.test.sample.data";

describe("Receipt Markdown Service", () => {

    it("should create ISSUE receipt MARKDOWN", () => {
        const markdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(issuePrintRequestDto);
        expect(markdown).is.not.empty;
    })

    it("should create BALANCE receipt MARKDOWN", () => {
        const markdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(balancePrintRequestDto);
        expect(markdown).is.not.empty;
    })

    it("should create REDEEM receipt MARKDOWN", () => {
        const markdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(redeemPrintRequestDto);
        expect(markdown).is.not.empty;
    })

})
