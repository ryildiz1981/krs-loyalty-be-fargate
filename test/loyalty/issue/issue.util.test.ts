import {expect} from "chai";
import sinon from "sinon";
import * as  terminalClientUtil from "../../../src/loyalty/terminalClientUtil";
import {toIssueResponseDto} from "../../../src/loyalty/issue/issue.util";
import {IssueResponseDto} from "../../../src/loyalty/issue/issue.interface";

describe("Issue Inquiry Util", () => {

    const anyIssueInquiryResponseMsg: string = '<STX>640<FS>194<FS>0<FS>|a%414090|<FS><FS><FS>Points=195         <FS>20240723<FS>024816<FS>42<FS><FS>00195<FS>Test old Card<FS>Thank you for using your Phillips 66    Card! You have just earned double       points on this purchase.                <FS>4<ETX>';

    it("should decode issue inquiry response msg", () => {
        sinon.stub(terminalClientUtil, 'bufferToText').returns(anyIssueInquiryResponseMsg);
        const dto: IssueResponseDto = toIssueResponseDto(Buffer.from('any check balance response message data .....'));
        sinon.restore();
        expect(dto.responseMessage).to.equal('Points=195');
        expect(dto.pointsBalance).to.equal(195);
        expect(dto.cardholderName).to.equal('Test old Card');
        expect(dto.instantPrizeMsg).to.equal('Thank you for using your Phillips 66 Card! You have just earned double points on this purchase.');
        expect(dto.newPoints).to.equal(4);
    })

})
