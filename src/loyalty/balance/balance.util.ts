import {BalanceCheckResponseDto} from "./balance.interface";
import {bufferToText} from "../terminalClientUtil";
import {removeZeroPaddings} from "../misc.util";

export const toBalanceCheckResponseDto = (data: Buffer): BalanceCheckResponseDto => {
    const msg = bufferToText(data).replace('<STX>', '').replace('<ETX>', '').split('<FS>') ?? [];
    if(msg?.length < 15) {
        return {} as BalanceCheckResponseDto;
    }
    const responseMessage = msg[6].trim();
    const pointsBalance = removeZeroPaddings(msg[11]);
    const cardholderName = msg[12];
    const instantPrizeMsg = msg[13];
    const monetaryBalance = msg[14].replaceAll(' ', '');

    return {
        responseMessage,
        pointsBalance,
        cardholderName,
        instantPrizeMsg,
        monetaryBalance
    } as BalanceCheckResponseDto
}

