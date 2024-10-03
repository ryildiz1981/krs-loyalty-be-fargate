import {expect} from "chai";
import sinon from "sinon";
import * as  terminalClientUtil from "../../../src/loyalty/terminalClientUtil";
import {toBalanceCheckResponseDto} from "../../../src/loyalty/balance/balance.util";
import {BalanceCheckResponseDto} from "../../../src/loyalty/balance/balance.interface";

describe("Balance Check Util", () => {
    const anyBalanceInquiryResponseMsg: string = '<STX>540<FS>194<FS>0<FS>|a#1650|<FS><FS><FS>Bal=000165         <FS>20171201<FS>124518<FS>78032<FS><FS>00165<FS>Ima Member<FS><FS>$   1.65<ETX>';
    it("should decode balance check response msg", () => {
        sinon.stub(terminalClientUtil, 'bufferToText').returns(anyBalanceInquiryResponseMsg);
        const dto: BalanceCheckResponseDto = toBalanceCheckResponseDto(Buffer.from('any check balance response message data .....'));
        sinon.restore();
        expect(dto.responseMessage).to.equal('Bal=000165');
        expect(dto.pointsBalance).to.equal('165');
        expect(dto.cardholderName).to.equal('Ima Member');
        expect(dto.instantPrizeMsg).to.equal('');
        expect(dto.monetaryBalance).to.equal('$1.65');
    })
})
