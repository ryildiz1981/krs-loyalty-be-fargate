import {ReceiptPrintRequestDto} from "../../../../../src/loyalty/receipt/receiptline/markdown/ReceiptMarkdownInterface";

export const issuePrintRequestDto: ReceiptPrintRequestDto = {
    transactionDate: '05/05/2024 13:35:20',
    terminalId: '194',
    cashierId: '3103',
    promotionCode: 4,
    cardNumber: '############5014',
    purchaseAmount: '$150.00',
    gallons: '75.0',
    pointsEarned: '4',
    invoiceNumber: '6874265',
    tailNumber: 'N8331R',
    currentBalance: '02413',
    cardholderName: 'HOWARD HUGHES',
    instantMessage: 'You just earned double points for using your Philips 66 card. Thanks you!',
    location: 'EARHART FLIGHT CENTER LINDBURG DR.',
    template: [
        {label: 'TRANSACTION INFORMATION', style: 'h1', align: 'center'},
        {label: 'Date', field: 'transactionDate', fieldCode: '%DT', style: 'text',align:'left'},
        {label: 'Terminal ID', field: 'terminalId', fieldCode: '%TD', style: 'text', align: 'left'},
        {label: 'Cashier', field: 'cashierId', fieldCode: '%CI', style: 'text', align: 'left'},
        {label: 'Promo ID', field: 'promotionCode', fieldCode: '%Xp', style: 'text', align: 'left'},
        {label: 'Account #', field: 'cardNumber', fieldCode: '%XC', style: 'text', align: 'left'},
        {label: 'Purchase Amount', field: 'purchaseAmount', fieldCode: '%XD', style: 'text', align: 'left'},
        {label: 'Gallons', field: 'gallons', fieldCode: '%XG', style: 'text', align: 'left'},
        {label: 'Points Earned', field: 'pointsEarned', fieldCode: '%UP', style: 'text', align: 'left'},
        {label: 'Invoice #', field: 'invoiceNumber', fieldCode: '%P2', style: 'text', align: 'left'},
        {label: 'Tail #', field: 'tailNumber', fieldCode: '%P3', style: 'text', align: 'left'},
        {label: 'Current Balance',style:'h2',align:'center'},
        {label: '', field: 'currentBalance', fieldCode: '%XB',style:'h2',align:'center'},
        {label: 'INSTANT MESSAGE',style:'h1',align:'center'},
        {label: '', field: 'instantMessage', fieldCode: '%XT', style: 'text', align: 'left'},
    ]
}

export const balancePrintRequestDto: ReceiptPrintRequestDto = {
    transactionDate: '05/05/2024 13:35:20',
    terminalId: '194',
    cashierId: '3103',
    promotionCode: 4,
    cardNumber: '############5014',
    purchaseAmount: '$150.00',
    gallons: '75.0',
    pointsEarned: '4',
    invoiceNumber: '6874265',
    tailNumber: 'N8331R',
    currentBalance: '02413',
    cardholderName: 'HOWARD HUGHES',
    instantMessage: 'You just earned double points for using your Philips 66 card. Thank you!',
    location: 'EARHART FLIGHT CENTER LINDBURG DR.',
    template: [
        {label: 'TRANSACTION INFORMATION', style: 'h1', align: 'center'},
        {label: 'Date', field: 'transactionDate', fieldCode: '%DT', style: 'text',align:'left'},
        {label: 'Cashier', field: 'cashierId', fieldCode: '%CI', style: 'text', align: 'left'},
        {label: 'Terminal ID', field: 'terminalId', fieldCode: '%TD', style: 'text', align: 'left'},
        {label: 'Card #', field: 'cardNumber', fieldCode: '%XC', style: 'text', align: 'left'},
        {label: 'CARDHOLDER INFORMATION',style:'h1',align:'center'},
        {label: '', field: 'cardholderName', fieldCode: '%XN',style:'text',align:'left'},
        {label: 'Balance', field: 'currentBalance', fieldCode: '%XB', style: 'text', align: 'left'}
    ]
}

export const redeemPrintRequestDto: ReceiptPrintRequestDto = {
    transactionDate: '05/05/2024 13:35:20',
    terminalId: '194',
    cashierId: '3103',
    promotionCode: 4,
    cardNumber: '############5014',
    purchaseAmount: '$150.00',
    gallons: '75.0',
    pointsEarned: '4',
    invoiceNumber: '6874265',
    tailNumber: 'N8331R',
    currentBalance: '02413',
    cardholderName: 'HOWARD HUGHES',
    instantMessage: 'You just earned double points for using your Philips 66 card. Thank you!',
    location: 'EARHART FLIGHT CENTER LINDBURG DR.',
    template: [
        {label: 'TRANSACTION INFORMATION', style: 'h1', align: 'center'},
        {label: 'Date', field: 'transactionDate', fieldCode: '%DT', style: 'text',align:'left'},
        {label: 'Cashier', field: 'cashierId', fieldCode: '%CI', style: 'text', align: 'left'},
        {label: 'Terminal ID', field: 'terminalId', fieldCode: '%TD', style: 'text', align: 'left'},
        {label: 'Card #', field: 'cardNumber', fieldCode: '%XC', style: 'text', align: 'left'},
        {label: 'CARDHOLDER INFORMATION',style:'h1',align:'center'},
        {label: '', field: 'cardholderName', fieldCode: '%XN',style:'text',align:'left'}
    ]
}
