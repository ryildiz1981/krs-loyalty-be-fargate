export type ReceiptLineStyle = 'h1' | 'h2' | 'text'
export type ReceiptLineAlign = 'left' | 'center'
export type ReceiptFieldCode = '%DT' | '%TD' | '%CI' | '%Xp' | '%XC' | '%XD' | '%XG' | '%UP' | '%P2' | '%P3' | '%XB' | '%XT' | '%XN';
export type ReceiptFieldName = 'transactionDate' | 'terminalId' | 'cashierId' | 'promotionCode' | 'cardNumber' | 'purchaseAmount' | 'gallons' | 'pointsEarned' | 'invoiceNumber' | 'tailNumber' | 'currentBalance' | 'instantMessage' | 'cardholderName';

export const ReceiptCodeToFieldMap: Record<ReceiptFieldCode, ReceiptFieldName> = {
    '%DT': 'transactionDate',
    '%TD': 'terminalId',
    '%CI': 'cashierId',
    '%Xp': 'promotionCode',
    '%XC': 'cardNumber',
    '%XD': 'purchaseAmount',
    '%XG': 'gallons',
    '%UP': 'pointsEarned',
    '%P2': 'invoiceNumber',
    '%P3': 'tailNumber',
    '%XB': 'currentBalance',
    '%XT': 'instantMessage',
    '%XN': 'cardholderName',
}

export const ReceiptFieldToCodeMap: Record<ReceiptFieldName, ReceiptFieldCode> = {
    transactionDate: '%DT',
    terminalId: '%TD',
    cashierId: '%CI',
    promotionCode: '%Xp',
    cardNumber: '%XD',
    purchaseAmount: '%XD',
    gallons: '%XG',
    pointsEarned: '%UP',
    invoiceNumber: '%P2',
    tailNumber: '%P3',
    currentBalance: '%XB',
    instantMessage: '%XT',
    cardholderName: '%XN'
}

export interface ReceiptTemplateLineDTO {
    label: string;
    field?: ReceiptFieldName;
    fieldCode?: ReceiptFieldCode;
    style?: ReceiptLineStyle;
    align?: ReceiptLineAlign;
}

export type ReceiptTemplateDTO = ReceiptTemplateLineDTO[];
