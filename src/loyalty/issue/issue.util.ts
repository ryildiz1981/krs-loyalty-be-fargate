import {IssueResponseDto} from "./issue.interface";
import {bufferToText} from "../terminalClientUtil";
import {removeZeroPaddings, toNumber} from "../misc.util";

export const toIssueResponseDto = (data: Buffer): IssueResponseDto => {
    const msg = bufferToText(data).replace('<STX>', '').replace('<ETX>', '').split('<FS>') ?? [];
    if(msg?.length < 15) {
        return {} as IssueResponseDto;
    }

    const responseMessage = msg[6].trim();
    const pointsBalance = toNumber(removeZeroPaddings(msg[11]));
    const cardholderName = msg[12];
    const instantPrizeMsg = msg[13]?.replace(/\s+/g, ' ').trim();
    const newPoints = toNumber(msg[14]);

    return {
        responseMessage,
        pointsBalance,
        cardholderName,
        instantPrizeMsg,
        newPoints
    } as IssueResponseDto
}
