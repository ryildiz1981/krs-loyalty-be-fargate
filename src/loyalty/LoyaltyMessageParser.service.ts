import {InquiryType, SocketResponseDto} from "./loyaltyInterface";
import {toDownloadConfigurationDto} from "./downloadConfig/downloadConfig.util";
import {toBalanceCheckResponseDto} from "./balance/balance.util";
import {toIssueResponseDto} from "./issue/issue.util";

export const toSocketResponseDto = (buf: Buffer, inquiryType: InquiryType): SocketResponseDto => {

    const data =
            inquiryType === 'DOWNLOAD_CONFIGURATION' ? toDownloadConfigurationDto(buf) :
            inquiryType === 'CHECK_BALANCE' ? toBalanceCheckResponseDto(buf) :
            inquiryType === 'ISSUE' ? toIssueResponseDto(buf) :
            buf;

    return {
        inquiryType,
        data
    } as SocketResponseDto
}
