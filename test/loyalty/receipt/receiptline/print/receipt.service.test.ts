import {expect} from "chai";
import {receiptService} from "../../../../../src/loyalty/receipt/receiptline/print/ReceiptService";
import {sampleLongMarkdown, sampleShortMarkdown} from "./receipt.service.test.sample.data";
import {receiptMarkdownService} from "../../../../../src/loyalty/receipt/receiptline/markdown/ReceiptMarkdownService";
import {
    balancePrintRequestDto,
    issuePrintRequestDto,
    redeemPrintRequestDto
} from "../markdown/receipt.markdown.service.test.sample.data";

describe("Receipt Service", () => {
    it("should create receipt with given markdown", () => {
        const receipt: string = receiptService.createReceiptByMarkdown(sampleShortMarkdown);
        expect(receipt).is.not.empty;
        expect(receipt.startsWith(`data:image/svg+xml;base64,`)).to.be.true;
    })

    it("should create receipt with a markdown including image", () => {
        const receipt: string = receiptService.createReceiptByMarkdown(sampleLongMarkdown);
        expect(receipt).is.not.empty;
        expect(receipt.startsWith(`data:image/svg+xml;base64,`)).to.be.true;
    })

    it("should create ISSUE type markdown and then create receipt", () => {

        const issueMarkdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(issuePrintRequestDto);
        expect(issueMarkdown).is.not.empty;

        const receipt: string = receiptService.createReceiptByMarkdown(issueMarkdown);
        expect(receipt).is.not.empty;
        expect(receipt.startsWith(`data:image/svg+xml;base64,`)).to.be.true;
    })

    it("should create BALANCE type markdown and then create receipt", () => {

        const balanceMarkdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(balancePrintRequestDto);
        expect(balanceMarkdown).is.not.empty;

        const receipt: string = receiptService.createReceiptByMarkdown(balanceMarkdown);
        expect(receipt).is.not.empty;
        expect(receipt.startsWith(`data:image/svg+xml;base64,`)).to.be.true;
    })

    it("should create REDEEM type markdown and then create receipt", () => {

        const redeemMarkdown: string = receiptMarkdownService.toWingPointsReceiptMarkDown(redeemPrintRequestDto);
        expect(redeemMarkdown).is.not.empty;

        const receipt: string = receiptService.createReceiptByMarkdown(redeemMarkdown);
        expect(receipt).is.not.empty;
        expect(receipt.startsWith(`data:image/svg+xml;base64,`)).to.be.true;
    })


})
