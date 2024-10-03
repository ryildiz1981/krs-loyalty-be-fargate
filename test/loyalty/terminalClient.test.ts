import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server } from "socket.io";
import {expect} from "chai";
import {
    InquiryType,
    LoyaltyDto, SocketResponseDto,
    WEB_SOCKET_INQUIRY_CHANNEL,
    WEB_SOCKET_COMMUNICATION_SECRET
} from "../../src/loyalty/loyaltyInterface";
import {EventEmitter} from "events";
import * as td from "testdouble";
import {TerminalClient} from "../../src/loyalty/terminalClient";
import moment from "moment/moment";

const net: any = td.replace('net');
const anything = td.matchers.anything();

describe("Terminal Client", () => {

    describe("Test Loyalty Terminal Client", () => {

        let io: Server, port: number;

        const STX_0x02 = ''; // Start of Text
        const FS_0x1c = ''; // Field Separator
        const ETX_0x03 = ''; // End of Text

        const getInputDto = (type: InquiryType): LoyaltyDto => {
            if(type === 'DOWNLOAD_CONFIGURATION') {
                return {
                    host: '173.195.232.2',
                    port: 965,
                    terminalId: '000003',
                    cashierId: '3103',
                    inquiryType: 'DOWNLOAD_CONFIGURATION' as InquiryType
                } as LoyaltyDto;
            } else if(type === 'CHECK_BALANCE') {
                return {
                    host: '173.195.232.2',
                    port: 965,
                    terminalId: '000003',
                    cashierId: '3103',
                    cardNumber: '7020113200035014',
                    inquiryType: 'CHECK_BALANCE' as InquiryType
                } as LoyaltyDto
            } else if(type === 'ISSUE') {
                return {
                    host: '173.195.232.2',
                    port: 965,
                    terminalId: '000003',
                    cashierId: '3103',
                    cardNumber: '7020113200035014',
                    amount: 200,
                    gallons: 100,
                    total: 300,
                    transactionDate: '2024-06-13',
                    date: '20240613',
                    time: '084100',
                    inquiryType: 'ISSUE' as InquiryType
                } as LoyaltyDto
            }
            return {} as LoyaltyDto
        }
        const getClient = (done: Mocha.Done): ClientSocket => {
            const clientSocket = ioc(`http://localhost:${port}`, {
                autoConnect: true,
                auth: {token: `${WEB_SOCKET_COMMUNICATION_SECRET}`}
            });
            clientSocket.connect()
            clientSocket.on("connect", done);
            return clientSocket;
        }

        const downloadConfigurationInputDto = getInputDto('DOWNLOAD_CONFIGURATION');
        const expectedConfigurationResultData = Buffer.from('sample-configuration-download-data', "utf8");

        const checkBalanceInputDto = getInputDto('CHECK_BALANCE');
        const expectedBalanceResultData = Buffer.from('sample-balance-check-data', "utf8");

        const issueInputDto = getInputDto('ISSUE');
        const expectedIssueResultData = Buffer.from('sample-issue-result-data', "utf8");

        const verifyEncodedInputMessages = (message: Buffer, dto: LoyaltyDto) => {
            if(dto.inquiryType === 'DOWNLOAD_CONFIGURATION') {
                const fields = message.toString().replaceAll(STX_0x02, '').replaceAll(ETX_0x03, '').split(FS_0x1c);
                expect(fields[3].endsWith(dto.terminalId)).to.be.true;
            } else if(dto.inquiryType === 'CHECK_BALANCE') {
                const fields = message.toString().replaceAll(STX_0x02, '').replaceAll(ETX_0x03, '').split(FS_0x1c);
                expect(fields[1]).to.equal(dto.terminalId);
                expect(fields[2]).to.equal(moment().format("YYYYMMDD"));
                expect(fields[8]).to.equal(dto.cashierId);
                expect(fields[9]).to.equal(dto.cardNumber);
            } else if(dto.inquiryType === 'ISSUE') {
                const fields = message.toString().replaceAll(STX_0x02, '').replaceAll(ETX_0x03, '').split(FS_0x1c);
                expect(fields[1]).to.equal(dto.terminalId);
                expect(fields[8]).to.equal(dto.cashierId);
                expect(fields[9]).to.equal(dto.cardNumber);
                expect(fields[11]).to.equal(dto.amount + '');
                expect(fields[13]).to.equal(dto.total + '');
            }
        }

        const getExpectedResultMessage = (dto: LoyaltyDto): Buffer =>
            dto.inquiryType === 'DOWNLOAD_CONFIGURATION' ? expectedConfigurationResultData :
            dto.inquiryType === 'CHECK_BALANCE' ? expectedBalanceResultData :
            dto.inquiryType === 'ISSUE' ? expectedIssueResultData : Buffer.from('undefined');

        const getTerminalClient = (webSocket: any, dto: LoyaltyDto) => {
            const netSocketStub: any = new EventEmitter();
            netSocketStub.connect = td.func();
            netSocketStub.setTimeout = td.func();
            netSocketStub.destroy = td.func();
            netSocketStub.write = td.func();

            td.when(new net.Socket()).thenReturn(netSocketStub);
            td.when(netSocketStub.destroy()).thenDo(() => netSocketStub.removeAllListeners());
            td.when(netSocketStub.connect(anything, anything)).thenDo(() => {
                netSocketStub.emit('connect');
            });

            const terminalClient = new TerminalClient(webSocket, dto);
            terminalClient.client = netSocketStub; // Remark: Testdouble can't mock the `new net.Socket()`, explicitly inject the netSocketStub.
            td.when(netSocketStub.write(anything)).thenDo((message: Buffer) => {
                verifyEncodedInputMessages(message, dto);
                terminalClient.onDataReceived(getExpectedResultMessage(dto));
            });
            return terminalClient;
        }

        before((done) => {

            const httpServer = createServer();
            io = new Server(httpServer);
            httpServer.listen(() => {
                port = (httpServer.address() as AddressInfo).port;
                io.use((socket: any, next) => {
                    if(WEB_SOCKET_COMMUNICATION_SECRET !== socket.handshake.auth.token) {
                        next(new Error('Unauthorized: Invalid Secret'));
                    } else {
                        return next();
                    }
                }).on("connection", (webSocket) => {
                    webSocket.on(WEB_SOCKET_INQUIRY_CHANNEL, (dto: LoyaltyDto) => {
                        getTerminalClient(webSocket, dto).handle();
                    })
                });
            });
            done()
        });

        after(() => {
            io.close();
        });

        it("should download configuration", (done) => {
            const client: ClientSocket = getClient(done);
            client.emit(WEB_SOCKET_INQUIRY_CHANNEL, downloadConfigurationInputDto)
            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (event: SocketResponseDto) => {
                expect(event.inquiryType).to.equal(downloadConfigurationInputDto.inquiryType);
                expect(event.data.toString()).to.equal(expectedConfigurationResultData.toString());
                client.disconnect();
            })
        })

        it("should check balance", (done) => {
            const client: ClientSocket = getClient(done);
            client.emit(WEB_SOCKET_INQUIRY_CHANNEL, checkBalanceInputDto)
            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (event: SocketResponseDto) => {
                expect(event.inquiryType).to.equal(checkBalanceInputDto.inquiryType);
                expect(event.data.toString()).to.equal(expectedBalanceResultData.toString());
                client.disconnect();
            })
        })

        it("should issue", (done) => {
            const client: ClientSocket = getClient(done);
            client.emit(WEB_SOCKET_INQUIRY_CHANNEL, issueInputDto)
            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (event: SocketResponseDto) => {
                expect(event.inquiryType).to.equal(issueInputDto.inquiryType);
                expect(event.data.toString()).to.equal(expectedIssueResultData.toString());
                client.disconnect();
            })
        })
    })
});
