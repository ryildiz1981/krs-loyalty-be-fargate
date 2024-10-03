import {LoyaltyDto, OPCODE_CHECK_BALANCE, OPCODE_DOWNLOAD_CONFIGURATION, OPCODE_ISSUE} from "./loyaltyInterface";
import moment from "moment/moment";

export const messageTemplates: { [key: number]: (data: LoyaltyDto) => (string | number)[] } = {
    10: (data: LoyaltyDto) => [ // issuance
        "640",              // Routing Code
        data.terminalId,
        data.date,          // Date TRM CCYYMMDD
        data.time,          // Time TRM hhmm00
        "v9.9LEK",          // Software Version
        "v9.9LEK",          // Parameter Version
        OPCODE_ISSUE,       // Transaction Type 10
        "0",                // Upload Flag
        data.cashierId,     // Login or from the config data ?
        data.cardNumber,    // Otherwise phone number ?
        data.productCode!, // product code has to be available for any issue operation.
        data.purchaseType === 'JET_FUEL' ? data.gallons : data.purchaseType === 'BONUS_POINTS' ? data.amount : data.gallons, // amount in USD or gallons
        data.promotionCode ?? '', // promotion code ????
        "0", // Redemption money ?? How to calculate this ?
        "0", // Redemption points ??
        data.invoiceNumber ?? '', // AN
        data.tailNumber ?? '', // Miscellaneous E.g., “TAIL #” for Wingpoints
        data.transactionDate
    ],
    30: (data: LoyaltyDto) => [ // balance
        //<STX>540<FS>194<FS>20171201<FS>124500<FS>9.9LEK<FS>9.9LEK<FS>30<FS>0<FS>3103<FS>7020113200
        // 435305<FS>0<FS><FS><FS><FS>0<FS><FS><FS>2016-05-27<ETX>
        "540", // Route code
        data.terminalId, // Terminal ID
        moment().format("YYYYMMDD"), // Terminal Date YYYYMMDD
        moment().format("HHmmss"), // Terminal Time HHMMSS
        "9.9LEK", // Software Version
        "9.9LEK", // Param version
        OPCODE_CHECK_BALANCE, // Transaction/Op code = 30 for balance
        "0", // UploadFlag
        data.cashierId, // 4 digit cashier ID
        data.cardNumber, // 16-20
        "0", // Category
        "0.0", // Gallons
        "0", // Promotion Number
        "0.0", // Amount
        "0", // Points to redeem
        "", // Invoice
        "", // Misc
        moment().format("YYYY-MM-DD")
    ],
    99: (data: LoyaltyDto) => [
        "640",
        "V" + OPCODE_DOWNLOAD_CONFIGURATION,
        "v9.9LEK",
        "T" + data.terminalId,
    ],
};
