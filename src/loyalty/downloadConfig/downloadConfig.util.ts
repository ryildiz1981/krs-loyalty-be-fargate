import {DownloadConfigurationDto, IssueProgram, IssuePrograms, ReceiptTemplates} from "./downloadConfig.interface";
import {bufferToText} from "../terminalClientUtil";
import {parseReceiptTemplate} from "../receipt/template/receiptTemplateParser.util";
import {ReceiptTemplateDTO} from "../receipt/template/receiptTemplateParser.interface";
import {Optional} from "../misc.interface";

const ISSUE_RECEIPT_START: string = '2Issue Receipt';
const BALANCE_RECEIPT_START: string = '2Bal Receipt';
const REDEEM_RECEIPT_START: string = '2Redeem Receipt';
const ISSUE_PROGRAM_AV_GAS_CODE_START: string = 'DAvgas';
const ISSUE_PROGRAM_JET_FUEL_CODE_START: string = 'DJet Fuel';
const ISSUE_PROGRAM_BONUS_POINTS_CODE_START: string = 'DBonus Points';

export const toDownloadConfigurationDto = (data: Buffer): DownloadConfigurationDto => {
    const msg = bufferToText(data)?.split('<FS>') ?? [];
    const host: string = getFieldValue(msg, 'zHOST', 'RIGHT', 'z') ?? '';
    const port: number = getFieldValueParsed(msg, 'zPORT1', 'RIGHT', 'z');
    const partnerLocation: string = getFieldValue(msg, 'zdisplay', 'RIGHT', 'z') ?? '';
    const partnerName: string = getFieldValue(msg, 'zVMAC', 'RIGHT', 'z') ?? '';
    const availableIssuePrograms: IssuePrograms = getAvailableIssuePrograms(msg);
    const receiptTemplates = getAvailableReceiptTemplates(msg);

    return {host, port, partnerName, partnerLocation, availableIssuePrograms, receiptTemplates};
}

export const configDownloadCompleted = (dto: DownloadConfigurationDto): boolean =>
    !!dto.host && !!dto.port && !!dto.partnerName && !!dto.partnerLocation && Object.keys(dto.availableIssuePrograms).length > 0 && Object.keys(dto.receiptTemplates).length > 2;


export const configDownloadMessagesCompleted = (dtoes: DownloadConfigurationDto[]): boolean =>
    configDownloadCompleted(mergeConfigDownloadMessages(dtoes));


const collectReceiptTemplateDTOes = (dtoes: DownloadConfigurationDto[]): ReceiptTemplates | undefined => {
    const issue: Optional<ReceiptTemplateDTO> = dtoes.find(dto => !!dto.receiptTemplates?.issue)?.receiptTemplates.issue;
    const redeem: Optional<ReceiptTemplateDTO> = dtoes.find(dto => !!dto.receiptTemplates?.redeem)?.receiptTemplates.redeem;
    const balance: Optional<ReceiptTemplateDTO> = dtoes.find(dto => !!dto.receiptTemplates?.balance)?.receiptTemplates.balance;
    const receipTemplates: ReceiptTemplates = {} as ReceiptTemplates;
    if(issue && issue.length > 0) {
        receipTemplates.issue = issue;
    }
    if(redeem && redeem.length > 0) {
        receipTemplates.redeem = redeem;
    }
    if(balance && balance.length > 0) {
        receipTemplates.balance = balance;
    }
    return Object.keys(receipTemplates).length > 0 ? receipTemplates : undefined;
}

export const mergeConfigDownloadMessages = (dtoes: DownloadConfigurationDto[]): DownloadConfigurationDto => {
    const host: string = dtoes.find(dto => !!dto.host)?.host ?? '';
    const port: number = dtoes.find(dto => !!dto.port)?.port ?? -1;
    const partnerName: string = dtoes.find(dto => !!dto.partnerName)?.partnerName ?? '';
    const partnerLocation: string = dtoes.find(dto => !!dto.partnerLocation)?.partnerLocation ?? '';
    const availableIssuePrograms: IssuePrograms = dtoes.find(dto => Object.keys(dto.availableIssuePrograms).length > 0)?.availableIssuePrograms ?? '' as IssuePrograms;
    const receiptTemplates: ReceiptTemplates = collectReceiptTemplateDTOes(dtoes) as ReceiptTemplates;
    return {host, port, partnerName, partnerLocation, availableIssuePrograms, receiptTemplates};
}

const getAvailableReceiptTemplates = (msg: any[]): ReceiptTemplates => {
    const issue: string = getFieldValue(msg, ISSUE_RECEIPT_START, 'RIGHT');
    const balance: string = getFieldValue(msg, BALANCE_RECEIPT_START, 'RIGHT');
    const redeem: string = getFieldValue(msg, REDEEM_RECEIPT_START, 'RIGHT');

    const templates = {} as ReceiptTemplates;
    if(issue) {
        templates.issue = parseReceiptTemplate(issue);
    }
    if(balance) {
        templates.balance = parseReceiptTemplate(balance);
    }
    if(redeem) {
        templates.redeem = parseReceiptTemplate(redeem);
    }
    return templates;
}

const getAvailableIssuePrograms = (msg: any[]): IssuePrograms => {
    const avGasCode = getFieldValueParsed(msg, ISSUE_PROGRAM_AV_GAS_CODE_START, 'LEFT', 'P') ?? '';
    const jetFuelCode = getFieldValueParsed(msg, ISSUE_PROGRAM_JET_FUEL_CODE_START, 'LEFT', 'P') ?? '';
    const bonusPointsCode = getFieldValueParsed(msg, ISSUE_PROGRAM_BONUS_POINTS_CODE_START, 'LEFT', 'P') ?? '';
    const issuePrograms = {} as IssuePrograms;
    if(avGasCode) {
        issuePrograms.avGas = {
            code: avGasCode,
            label: 'Av Gas'
        } as IssueProgram;
    }
    if(jetFuelCode) {
        issuePrograms.jetFuel = {
            code: jetFuelCode,
            label: 'Jet Fuel'
        } as IssueProgram;
    }
    if(bonusPointsCode) {
        issuePrograms.bonusPoints = {
            code: bonusPointsCode,
            label: 'Bonus Points'
        } as IssueProgram;
    }
    return issuePrograms;
}

const getFieldValueParsed = (msg: any[], keyFieldValue: string, pickValueAt: 'LEFT' | 'RIGHT', removePrefixValue?: string) => {
    return parseValue(getFieldValue(msg, keyFieldValue, pickValueAt, removePrefixValue));
}

const parseValue = (obj: any) => {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return undefined;
    }
}

const getFieldValue = (msg: any[], keyFieldValue: string, pickValueAt: 'LEFT' | 'RIGHT', removePrefixValue?: string) => {

    const keyIndex = msg.indexOf(keyFieldValue);
    const targetIndx = keyIndex + (pickValueAt === 'RIGHT' ? +1 : -1);

    if(keyIndex < 0 || targetIndx < 0 || targetIndx >= msg.length) {
        return undefined;
    }

    let value = msg[targetIndx];
    const indxETX = value.indexOf('<ETX>');
    if(indxETX > 0) {
        value = value.substring(0, indxETX);
    }

    if(removePrefixValue && value.startsWith(removePrefixValue)) {
        return value.substring(removePrefixValue.length);
    }
    return value;
}
