export type PURCHASE_TYPE = 'JET_FUEL' | 'BONUS_POINTS' | 'AV_GAS' | undefined;

export interface IssueResponseDto {
    responseMessage: string,
    pointsBalance: number,
    cardholderName: string,
    instantPrizeMsg: string,
    newPoints: number
}
