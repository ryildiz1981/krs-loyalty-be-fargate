import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import {assert, expect} from "chai";
import {
    InquiryType,
    LoyaltyDto,
    WEB_SOCKET_INQUIRY_CHANNEL,
    WEB_SOCKET_COMMUNICATION_SECRET
} from "../../src/loyalty/loyaltyInterface";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve: any) => {
        socket.once(event, resolve);
    });
}

describe("Web Socket Server", () => {

    describe("Test Web Socket Basic Functionality", () => {

        let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket, port: number;

        before((done) => {

            const httpServer = createServer();
            io = new Server(httpServer);
            httpServer.listen(() => {
                port = (httpServer.address() as AddressInfo).port;
                clientSocket = ioc(`http://localhost:${port}`, {
                    autoConnect: true,
                    auth: {token: `${WEB_SOCKET_COMMUNICATION_SECRET}`}
                });
                io.use((socket: any, next) => {
                    if(WEB_SOCKET_COMMUNICATION_SECRET !== socket.handshake.auth.token) {
                        next(new Error('Unauthorized: Invalid Secret'));
                    } else {
                        return next();
                    }
                }).on("connection", (socket) => {
                    serverSocket = socket;
                });
                clientSocket.on("connect", done);
            });
        });

        after(() => {
            io.close();
            clientSocket.disconnect();
        });

        it("should emit and listen", (done) => {
            clientSocket.on("event-name", (arg) => {
                assert.equal(arg, "world");
                done();
            });
            serverSocket.emit("event-name", "world");
        });

        it("should work with an acknowledgement", (done) => {
            serverSocket.on("event-name", (cb) => {
                cb("hola");
            });
            clientSocket.emit("event-name", (arg: any) => {
                assert.equal(arg, "hola");
                done();
            });
        });

        it("should work with emitWithAck()", async () => {
            serverSocket.on("foo", (cb) => {
                cb("bar");
            });
            const result = await clientSocket.emitWithAck("foo");
            assert.equal(result, "bar");
        });

        it("should work with waitFor()", () => {
            clientSocket.emit("baz");

            return waitFor(serverSocket, "baz");
        });
    })

    describe("Test Web Socket With Loyalty DTO", () => {

        let io: Server, port: number;

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
                    transactionDate: '20240613T084100',
                    date: '20240613',
                    time: '0841',
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
        const expectedConfigurationData = 'sample-configuration';

        const checkBalanceInputDto = getInputDto('CHECK_BALANCE');
        const expectedBalanceData = 'sample-balance-data';

        const issueInputDto = getInputDto('ISSUE');
        const expectedIssueResultData = 'sample-issue-result-data';

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
                    // serverSocket = socket;
                    webSocket.on(WEB_SOCKET_INQUIRY_CHANNEL, (dto: LoyaltyDto) => {
                        if(dto.inquiryType === 'DOWNLOAD_CONFIGURATION') {
                            expect(dto.host).to.equal(downloadConfigurationInputDto.host);
                            expect(dto.port).to.equal(downloadConfigurationInputDto.port);
                            expect(dto.terminalId).to.equal(downloadConfigurationInputDto.terminalId);
                            expect(dto.cashierId).to.equal(downloadConfigurationInputDto.cashierId);
                            expect(dto.inquiryType).to.equal(downloadConfigurationInputDto.inquiryType);
                            webSocket.emit(WEB_SOCKET_INQUIRY_CHANNEL, expectedConfigurationData);
                        } else if(dto.inquiryType === 'CHECK_BALANCE') {
                            expect(dto.host).to.equal(checkBalanceInputDto.host);
                            expect(dto.port).to.equal(checkBalanceInputDto.port);
                            expect(dto.terminalId).to.equal(checkBalanceInputDto.terminalId);
                            expect(dto.cashierId).to.equal(checkBalanceInputDto.cashierId);
                            expect(dto.cardNumber).to.equal(checkBalanceInputDto.cardNumber);
                            expect(dto.inquiryType).to.equal(checkBalanceInputDto.inquiryType);
                            webSocket.emit(WEB_SOCKET_INQUIRY_CHANNEL, expectedBalanceData);
                        } else if(dto.inquiryType === 'ISSUE') {
                            expect(dto.host).to.equal(issueInputDto.host);
                            expect(dto.port).to.equal(issueInputDto.port);
                            expect(dto.terminalId).to.equal(issueInputDto.terminalId);
                            expect(dto.cashierId).to.equal(issueInputDto.cashierId);
                            expect(dto.cardNumber).to.equal(issueInputDto.cardNumber);
                            expect(dto.gallons).to.equal(issueInputDto.gallons);
                            expect(dto.amount).to.equal(issueInputDto.amount);
                            expect(dto.total).to.equal(issueInputDto.total);
                            expect(dto.transactionDate).to.equal(issueInputDto.transactionDate);
                            expect(dto.date).to.equal(issueInputDto.date);
                            expect(dto.time).to.equal(issueInputDto.time);
                            expect(dto.inquiryType).to.equal(issueInputDto.inquiryType);
                            webSocket.emit(WEB_SOCKET_INQUIRY_CHANNEL, expectedIssueResultData);
                        }
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
            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (configData: string) => {
                expect(configData).to.equal(expectedConfigurationData);
                client.disconnect();
            })
        })

        it("should check balance", (done) => {
            const client: ClientSocket = getClient(done);
            client.emit(WEB_SOCKET_INQUIRY_CHANNEL, checkBalanceInputDto)

            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (configData: string) => {
                expect(configData).to.equal(expectedBalanceData);
                client.disconnect();
            })
        })


        it("should issue", (done) => {
            const client: ClientSocket = getClient(done);
            client.emit(WEB_SOCKET_INQUIRY_CHANNEL, issueInputDto)

            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (configData: string) => {
                expect(configData).to.equal(expectedIssueResultData);
                client.disconnect();
            })
        })


        it("should issue 2", (done) => {
            const client: ClientSocket = getClient(done);
            client.emit(WEB_SOCKET_INQUIRY_CHANNEL, issueInputDto)

            client.on(WEB_SOCKET_INQUIRY_CHANNEL, (configData: string) => {
                expect(configData).to.equal(expectedIssueResultData);
                client.disconnect();
            })
        })
    })

});
