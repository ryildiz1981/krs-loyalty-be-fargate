import {expect} from "chai";
import {parseReceiptTemplate} from "../../../../src/loyalty/receipt/template/receiptTemplateParser.util";
import {
    ReceiptTemplateDTO
} from "../../../../src/loyalty/receipt/template/receiptTemplateParser.interface";

describe("Parse Issue Receipt Template", () => {

    const issue: string = '/%LF10000~~%CE%2XWingPoints%1X~ ~%CE%2X%VN%1X~%CE%2X%SA%1X~       ~%IP%CETRANSACTION INFORMATION~Date:            %DT~Terminal ID:     %TD~Cashier:         %CI~Promo ID:        %Xp~Account #:       %XC~~%CE   ~Purchase Amount: $%XD~Gallons:         %XG~Points Earned:   %UP~~Invoice #:       %P2~Tail #:          %P3~%CE ~~%IP%CE%2X%XN~%CE%2HCurrent Balance~%CE%2H%XB~%CE ~~%IFXT{~%IP%CEINSTANT MESSAGE~%XT~%FI}~%CE   ~%T1'

    const balance: string = '/%CE---- LOYALTY BALANCE INQUIRY -----~%CE       ~%CE%2X%VN%1X~%CE       ~~%IP%CE     TRANSACTION INFORMATION      ~Date:            %DT~Cashier:         %CI~Terminal ID:     %TD~Card #:          %XC~%CE   ~~%IP%CE     CARDHOLDER INFORMATION     ~%CE     ~%CE%2X ** %XN **~%CE%2X Balance = %XB %1X  ~ ~%CE   ~%CE---- LOYALTY BALANCE INQUIRY -----~';

    const redeem: string = '/%CE---- LOYALTY REDEMPTION -----~%CE       ~%CE%2X%VN%1X~%CE       ~~%IP%CE     TRANSACTION INFORMATION      ~Date:            %DT~Cashier:         %CI~Terminal ID:     %TD~Auth number:     %XA~Card #:          %XC~%CE   ~~%IP%CE     CARDHOLDER INFORMATION       ~~%CE%2X ** %XN **~%CE%2X Points Redeemed = %XR %1X  ~%CE       ~~%IFXs{~%CE   ~X--------------------------------------~          (Cardholder Name)~%FI}~%C';

    it("should decode REDEEM receipt template", () => {

        const receiptTemplateLineDTOes: ReceiptTemplateDTO = parseReceiptTemplate(redeem);
        expect(receiptTemplateLineDTOes[0].label).to.equal('TRANSACTION INFORMATION');
        expect(receiptTemplateLineDTOes[0].style).to.equal('h1');
        expect(receiptTemplateLineDTOes[0].align).to.equal('center');

        expect(receiptTemplateLineDTOes[1].label).to.equal('Date');
        expect(receiptTemplateLineDTOes[1].field).to.equal('transactionDate');
        expect(receiptTemplateLineDTOes[1].fieldCode).to.equal('%DT');
        expect(receiptTemplateLineDTOes[1].style).to.equal('text');
        expect(receiptTemplateLineDTOes[1].align).to.equal('left');

        expect(receiptTemplateLineDTOes[2].label).to.equal('Cashier');
        expect(receiptTemplateLineDTOes[2].field).to.equal('cashierId');
        expect(receiptTemplateLineDTOes[2].fieldCode).to.equal('%CI');
        expect(receiptTemplateLineDTOes[2].style).to.equal('text');
        expect(receiptTemplateLineDTOes[2].align).to.equal('left');

        expect(receiptTemplateLineDTOes[3].label).to.equal('Terminal ID');
        expect(receiptTemplateLineDTOes[3].field).to.equal('terminalId');
        expect(receiptTemplateLineDTOes[3].fieldCode).to.equal('%TD');
        expect(receiptTemplateLineDTOes[3].style).to.equal('text');
        expect(receiptTemplateLineDTOes[3].align).to.equal('left');

        expect(receiptTemplateLineDTOes[4].label).to.equal('Card #');
        expect(receiptTemplateLineDTOes[4].field).to.equal('cardNumber');
        expect(receiptTemplateLineDTOes[4].fieldCode).to.equal('%XC');
        expect(receiptTemplateLineDTOes[4].style).to.equal('text');
        expect(receiptTemplateLineDTOes[4].align).to.equal('left');

        expect(receiptTemplateLineDTOes[5].label).to.equal('CARDHOLDER INFORMATION');
        expect(receiptTemplateLineDTOes[5].style).to.equal('h1');
        expect(receiptTemplateLineDTOes[5].align).to.equal('center');

        expect(receiptTemplateLineDTOes[6].field).to.equal('cardholderName');
        expect(receiptTemplateLineDTOes[6].fieldCode).to.equal('%XN');
        expect(receiptTemplateLineDTOes[6].style).to.equal('text');
        expect(receiptTemplateLineDTOes[6].align).to.equal('left');

    })

    it("should decode BALANCE receipt template", () => {

        const receiptTemplateLineDTOes: ReceiptTemplateDTO = parseReceiptTemplate(balance);
        expect(receiptTemplateLineDTOes[0].label).to.equal('TRANSACTION INFORMATION');
        expect(receiptTemplateLineDTOes[0].style).to.equal('h1');
        expect(receiptTemplateLineDTOes[0].align).to.equal('center');

        expect(receiptTemplateLineDTOes[1].label).to.equal('Date');
        expect(receiptTemplateLineDTOes[1].field).to.equal('transactionDate');
        expect(receiptTemplateLineDTOes[1].fieldCode).to.equal('%DT');
        expect(receiptTemplateLineDTOes[1].style).to.equal('text');
        expect(receiptTemplateLineDTOes[1].align).to.equal('left');

        expect(receiptTemplateLineDTOes[2].label).to.equal('Cashier');
        expect(receiptTemplateLineDTOes[2].field).to.equal('cashierId');
        expect(receiptTemplateLineDTOes[2].fieldCode).to.equal('%CI');
        expect(receiptTemplateLineDTOes[2].style).to.equal('text');
        expect(receiptTemplateLineDTOes[2].align).to.equal('left');

        expect(receiptTemplateLineDTOes[3].label).to.equal('Terminal ID');
        expect(receiptTemplateLineDTOes[3].field).to.equal('terminalId');
        expect(receiptTemplateLineDTOes[3].fieldCode).to.equal('%TD');
        expect(receiptTemplateLineDTOes[3].style).to.equal('text');
        expect(receiptTemplateLineDTOes[3].align).to.equal('left');

        expect(receiptTemplateLineDTOes[4].label).to.equal('Card #');
        expect(receiptTemplateLineDTOes[4].field).to.equal('cardNumber');
        expect(receiptTemplateLineDTOes[4].fieldCode).to.equal('%XC');
        expect(receiptTemplateLineDTOes[4].style).to.equal('text');
        expect(receiptTemplateLineDTOes[4].align).to.equal('left');

        expect(receiptTemplateLineDTOes[5].label).to.equal('CARDHOLDER INFORMATION');
        expect(receiptTemplateLineDTOes[5].style).to.equal('h1');
        expect(receiptTemplateLineDTOes[5].align).to.equal('center');

        expect(receiptTemplateLineDTOes[6].field).to.equal('cardholderName');
        expect(receiptTemplateLineDTOes[6].fieldCode).to.equal('%XN');
        expect(receiptTemplateLineDTOes[6].style).to.equal('text');
        expect(receiptTemplateLineDTOes[6].align).to.equal('left');

        expect(receiptTemplateLineDTOes[7].label).to.equal('Balance');
        expect(receiptTemplateLineDTOes[7].field).to.equal('currentBalance');
        expect(receiptTemplateLineDTOes[7].fieldCode).to.equal('%XB');
        expect(receiptTemplateLineDTOes[7].style).to.equal('text');
        expect(receiptTemplateLineDTOes[7].align).to.equal('left');

    })

    it("should decode ISSUE receipt template", () => {

        const receiptTemplateLineDTOes: ReceiptTemplateDTO = parseReceiptTemplate(issue);

        expect(receiptTemplateLineDTOes[0].label).to.equal('TRANSACTION INFORMATION');
        expect(receiptTemplateLineDTOes[0].style).to.equal('h1');
        expect(receiptTemplateLineDTOes[0].align).to.equal('center');

        expect(receiptTemplateLineDTOes[1].label).to.equal('Date');
        expect(receiptTemplateLineDTOes[1].field).to.equal('transactionDate');
        expect(receiptTemplateLineDTOes[1].fieldCode).to.equal('%DT');
        expect(receiptTemplateLineDTOes[1].style).to.equal('text');
        expect(receiptTemplateLineDTOes[1].align).to.equal('left');

        expect(receiptTemplateLineDTOes[2].label).to.equal('Terminal ID');
        expect(receiptTemplateLineDTOes[2].field).to.equal('terminalId');
        expect(receiptTemplateLineDTOes[2].fieldCode).to.equal('%TD');
        expect(receiptTemplateLineDTOes[2].style).to.equal('text');
        expect(receiptTemplateLineDTOes[2].align).to.equal('left');

        expect(receiptTemplateLineDTOes[3].label).to.equal('Cashier');
        expect(receiptTemplateLineDTOes[3].field).to.equal('cashierId');
        expect(receiptTemplateLineDTOes[3].fieldCode).to.equal('%CI');
        expect(receiptTemplateLineDTOes[3].style).to.equal('text');
        expect(receiptTemplateLineDTOes[3].align).to.equal('left');

        expect(receiptTemplateLineDTOes[4].label).to.equal('Promo ID');
        expect(receiptTemplateLineDTOes[4].field).to.equal('promotionCode');
        expect(receiptTemplateLineDTOes[4].fieldCode).to.equal('%Xp');
        expect(receiptTemplateLineDTOes[4].style).to.equal('text');
        expect(receiptTemplateLineDTOes[4].align).to.equal('left');

        expect(receiptTemplateLineDTOes[5].label).to.equal('Account #');
        expect(receiptTemplateLineDTOes[5].field).to.equal('cardNumber');
        expect(receiptTemplateLineDTOes[5].fieldCode).to.equal('%XC');
        expect(receiptTemplateLineDTOes[5].style).to.equal('text');
        expect(receiptTemplateLineDTOes[5].align).to.equal('left');

        expect(receiptTemplateLineDTOes[6].label).to.equal('Purchase Amount');
        expect(receiptTemplateLineDTOes[6].field).to.equal('purchaseAmount');
        expect(receiptTemplateLineDTOes[6].fieldCode).to.equal('%XD');
        expect(receiptTemplateLineDTOes[6].style).to.equal('text');
        expect(receiptTemplateLineDTOes[6].align).to.equal('left');

        expect(receiptTemplateLineDTOes[7].label).to.equal('Gallons');
        expect(receiptTemplateLineDTOes[7].field).to.equal('gallons');
        expect(receiptTemplateLineDTOes[7].fieldCode).to.equal('%XG');
        expect(receiptTemplateLineDTOes[7].style).to.equal('text');
        expect(receiptTemplateLineDTOes[7].align).to.equal('left');

        expect(receiptTemplateLineDTOes[8].label).to.equal('Points Earned');
        expect(receiptTemplateLineDTOes[8].field).to.equal('pointsEarned');
        expect(receiptTemplateLineDTOes[8].fieldCode).to.equal('%UP');
        expect(receiptTemplateLineDTOes[8].style).to.equal('text');
        expect(receiptTemplateLineDTOes[8].align).to.equal('left');

        expect(receiptTemplateLineDTOes[9].label).to.equal('Invoice #');
        expect(receiptTemplateLineDTOes[9].field).to.equal('invoiceNumber');
        expect(receiptTemplateLineDTOes[9].fieldCode).to.equal('%P2');
        expect(receiptTemplateLineDTOes[9].style).to.equal('text');
        expect(receiptTemplateLineDTOes[9].align).to.equal('left');

        expect(receiptTemplateLineDTOes[10].label).to.equal('Tail #');
        expect(receiptTemplateLineDTOes[10].field).to.equal('tailNumber');
        expect(receiptTemplateLineDTOes[10].fieldCode).to.equal('%P3');
        expect(receiptTemplateLineDTOes[10].style).to.equal('text');
        expect(receiptTemplateLineDTOes[10].align).to.equal('left');

        expect(receiptTemplateLineDTOes[11].label).to.equal('Current Balance');
        expect(receiptTemplateLineDTOes[11].field).to.equal(undefined);
        expect(receiptTemplateLineDTOes[11].fieldCode).to.equal(undefined);
        expect(receiptTemplateLineDTOes[11].style).to.equal('h2');
        expect(receiptTemplateLineDTOes[11].align).to.equal('center');

        expect(receiptTemplateLineDTOes[12].label).to.equal('');
        expect(receiptTemplateLineDTOes[12].field).to.equal('currentBalance');
        expect(receiptTemplateLineDTOes[13].label).to.equal('INSTANT MESSAGE');
        expect(receiptTemplateLineDTOes[14].field).to.equal('instantMessage');

    })

})
