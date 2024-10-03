import {ReceiptTemplateDTO} from "../receipt/template/receiptTemplateParser.interface";

export interface IssueProgram {
    code: number,
    label: string
}

export interface IssuePrograms {
    avGas?: IssueProgram // DAvgas
    jetFuel?: IssueProgram 	// DJet Fuel
    bonusPoints?: IssueProgram // DBonus Points
}

export interface ReceiptTemplates {
    issue?: ReceiptTemplateDTO,
    balance?: ReceiptTemplateDTO,
    redeem?: ReceiptTemplateDTO
}

export interface DownloadConfigurationDto {
    host: string,
    port: number,

    availableIssuePrograms: IssuePrograms

    partnerName: string,
    partnerLocation: string,

    receiptTemplates: ReceiptTemplates
}
