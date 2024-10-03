import {DownloadConfigurationDto} from "./downloadConfig/downloadConfig.interface";
import {BalanceCheckResponseDto} from "./balance/balance.interface";
import {IssueResponseDto, PURCHASE_TYPE} from "./issue/issue.interface";
import * as process from "node:process";

export type InquiryType = 'DOWNLOAD_CONFIGURATION' | 'ISSUE' | 'CHECK_BALANCE';
export const WEB_SOCKET_COMMUNICATION_SECRET: string = process.env.WEB_SOCKET_COMMUNICATION_SECRET!
export const WEB_SOCKET_INQUIRY_CHANNEL: string = process.env.WEB_SOCKET_INQUIRY_CHANNEL!;
export const WEB_SOCKET_RECEIPT_CHANNEL: string = process.env.WEB_SOCKET_RECEIPT_CHANNEL!;

export type SocketResponseDataType = DownloadConfigurationDto | BalanceCheckResponseDto | IssueResponseDto | Buffer;

export interface SocketResponseDto {
    inquiryType: InquiryType;
    data: SocketResponseDataType;
}

export interface LoyaltyDto {
    host: string,
    port: number,
    terminalId: string,
    cashierId: string,
    cardNumber: string,
    phoneNumber: string,
    productCode?: number,
    amount: number, // amount in USD
    gallons: number, // 200 for 20.0 gallons
    total: number, // Note: to be removed, this is not used
    transactionDate: string,
    promotionCode: number,
    invoiceNumber: string,
    tailNumber: string,
    date: string,
    time: string,
    purchaseType?: PURCHASE_TYPE,
    inquiryType: InquiryType
}

export const OPCODE_ISSUE: number = 10;
export const OPCODE_CHECK_BALANCE: number = 30;
export const OPCODE_DOWNLOAD_CONFIGURATION: number = 99;

export const OPCODE_BY_INQUIRY_TYPE = {
    DOWNLOAD_CONFIGURATION:  OPCODE_DOWNLOAD_CONFIGURATION,
    ISSUE: OPCODE_ISSUE,
    CHECK_BALANCE: OPCODE_CHECK_BALANCE
}

export const STX = Buffer.from([0x02]); // Start of Text
export const FS  = Buffer.from([0x1c]); // Field Separator
export const ETX = Buffer.from([0x03]); // End of Text

