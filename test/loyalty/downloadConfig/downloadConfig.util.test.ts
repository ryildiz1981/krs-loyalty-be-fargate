import {toDownloadConfigurationDto} from "../../../src/loyalty/downloadConfig/downloadConfig.util";
import {DownloadConfigurationDto} from "../../../src/loyalty/downloadConfig/downloadConfig.interface";
import {expect} from "chai";
import sinon from "sinon";
import * as  terminalClientUtil from "../../../src/loyalty/terminalClientUtil";

describe("Download Config Util", () => {

    const anyDownloadConfigMsg = '<SOH><FS>V1<FS>c0<FS>L1<FS>G0<FS>|0<FS>x0<FS>P0<FS>Q1<FS>p1<FS>v0<FS>Z1<FS>Z0<FS>zdemo<FS>z0<FS>zdisplay<FS>zTest Location<FS>zstrname<FS>z<FS>zstraddr<FS>z<FS>zhdr1<FS>z<FS>zhdr2<FS>z<FS>zhdr3<FS>z<FS>zhdr4<FS>z<FS>ztrl1<FS>z<FS>ztrl2<FS>z<FS>ztrl3<FS>z<FS>ztrl4<FS>z<FS>zphnum1<FS>z18778340101<FS>zpredial<FS>z1<FS>zionline<FS>z1<FS>zcashid<FS>z0<FS>zadmin<FS>z3103<FS>zROUTE1<FS>z540<FS>zROUTE3<FS>z640<FS>zPORT1<FS>z293<FS>zPORT3<FS>z296<FS>zDOREDEEM<FS>z0<FS>zDOLMISC<FS>z1<FS>zLMISC<FS>zTail #<FS>zONLYADMIN<FS>z2<FS>zCPROMPT<FS>zEnter User ID<FS>zCASHID<FS>z0<FS>zVMAC<FS>zWingPoints<FS>zDOINVOICE<FS>z1<FS>zLOYISSUE<FS>z1<FS>zDOCS<FS>z1<FS>zPHONE1<FS>z12064414635<FS>zHOST<FS>z173.195.232.2<FS>zKRSIIN3<FS>z702011<FS>zPHNUM1<FS>z18778340101<FS>zDEFCAT<FS>z0<FS>zG<ETX><SOH>ALDEC<FS>z1<FS>z*ZR<FS>z1<FS>*3<FS>P4<FS>DAvgas<FS>P6<FS>DBonus Points<FS>P5<FS>DJet Fuel<FS>C0<FS>/485<FS>1LR.I<FS>2Issue Receipt<FS>/%LF10000~~%CE%2XWingPoints%1X~ ~%CE%2X%VN%1X~%CE%2X%SA%1X~       ~%IP%CETRANSACTION INFORMATION~Date:            %DT~Terminal ID:     %TD~Cashier:         %CI~Promo ID:        %Xp~Account #:       %XC~~%CE   ~Purchase Amount: $%XD~Gallons:         %XG~Points Earned:   %UP~~Invoice #:       %P2~Tail #:          %P3~%CE ~~%IP%CE%2X%XN~%CE%2HCurrent Balance~%CE%2H%XB~%CE ~~%IFXT{~%IP%CEINSTANT MESSAGE~%XT~%FI}~%CE   ~%T1<ETX><SOH>~%T2~%T3~%T4~%CEVisit www.wingpoints.com~%CEfor program details.<FS>/457<FS>1LR.R<FS>2Redeem Receipt<FS>/%CE---- LOYALTY REDEMPTION -----~%CE       ~%CE%2X%VN%1X~%CE       ~~%IP%CE     TRANSACTION INFORMATION      ~Date:            %DT~Cashier:         %CI~Terminal ID:     %TD~Auth number:     %XA~Card #:          %XC~%CE   ~~%IP%CE     CARDHOLDER INFORMATION       ~~%CE%2X ** %XN **~%CE%2X Points Redeemed = %XR %1X  ~%CE       ~~%IFXs{~%CE   ~X--------------------------------------~          (Cardholder Name)~%FI}~%C<ETX><STX>E    ~~%CE---- LOYALTY REDEMPTION -----<FS>/346<FS>1LR.B<FS>2Bal Receipt<FS>/%CE---- LOYALTY BALANCE INQUIRY -----~%CE       ~%CE%2X%VN%1X~%CE       ~~%IP%CE     TRANSACTION INFORMATION      ~Date:            %DT~Cashier:         %CI~Terminal ID:     %TD~Card #:          %XC~%CE   ~~%IP%CE     CARDHOLDER INFORMATION     ~%CE     ~%CE%2X ** %XN **~%CE%2X Balance = %XB %1X  ~ ~%CE   ~%CE---- LOYALTY BALANCE INQUIRY -----~<FS>E1<ETX>';

    it("should decode downloaded configuration", () => {
        sinon.stub(terminalClientUtil, 'bufferToText').returns(anyDownloadConfigMsg);
        const dto: DownloadConfigurationDto = toDownloadConfigurationDto(Buffer.from('any download config message data .....'));
        sinon.restore();

        expect(dto.host).to.equal('173.195.232.2');
        expect(dto.port).to.equal(293);
        expect(dto.partnerName).to.equal('WingPoints');
        expect(dto.partnerLocation).to.equal('Test Location');

        expect(dto.receiptTemplates.issue).is.not.to.be.empty;
        expect(dto.receiptTemplates.redeem).is.not.to.be.empty;
        expect(dto.receiptTemplates.balance).is.not.to.be.empty;

        expect(dto.availableIssuePrograms.avGas?.code).to.equal(4);
        expect(dto.availableIssuePrograms.avGas?.label).to.equal('Av Gas');

        expect(dto.availableIssuePrograms.jetFuel?.code).to.equal(5);
        expect(dto.availableIssuePrograms.jetFuel?.label).to.equal('Jet Fuel');

        expect(dto.availableIssuePrograms.bonusPoints?.code).to.equal(6);
        expect(dto.availableIssuePrograms.bonusPoints?.label).to.equal('Bonus Points');

    })

})
