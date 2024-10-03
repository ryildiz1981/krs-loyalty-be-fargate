import * as net from "net";
import * as console from "node:console";
import {
    ETX,
    FS,
    OPCODE_BY_INQUIRY_TYPE,
    STX,
    WEB_SOCKET_INQUIRY_CHANNEL,
    LoyaltyDto,
    SocketResponseDto
} from "./loyaltyInterface";
import {messageTemplates} from "./terminalClientMessageTemplates";
import {logBuffer} from "./terminalClientUtil";
import {toSocketResponseDto} from "./LoyaltyMessageParser.service";
import {DownloadConfigurationDto} from "./downloadConfig/downloadConfig.interface";
import {configDownloadCompleted, mergeConfigDownloadMessages} from "./downloadConfig/downloadConfig.util";

export class TerminalClient {
    public client: net.Socket;
    private readonly webSocket: any;
    private readonly messages: any[] = [];
    private readonly dto: LoyaltyDto;
    private verbose: boolean = true;

    constructor(webSocket: any, dto: LoyaltyDto) {
        this.client = new net.Socket();
        this.webSocket = webSocket;
        this.dto = dto;
    }

    public handle = () => {
        this.connect().then(() => {
            const opcode = OPCODE_BY_INQUIRY_TYPE[this.dto.inquiryType];
            if(!opcode) {
                console.error(`Unknown opcode: ${opcode}`);
                return;
            }
            this.sendMessage(opcode);
        }, (error) => {
            console.error(`Connection Error: ${error}`);
        });
    }

    private connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.connect(this.dto.port, this.dto.host, () => {
                console.log(`==== Connected to server: ${this.dto.host}:${this.dto.port} ====`);
                resolve();
            });

            this.client.on("data", (data: Buffer) => {
                this.onDataReceived(data);
            });
            this.client.on("close", () => {
                console.log("==== Connection closed ====");
            });
            this.client.on("error", reject);
        });
    }

    onDataReceived = (data: Buffer) => {
        if(this.verbose) {
            console.log("\n\n==== Response ==== ");
            logBuffer(data);
        }
        const responseDto: SocketResponseDto = toSocketResponseDto(data, this.dto.inquiryType);
        if(this.dto.inquiryType === 'DOWNLOAD_CONFIGURATION') {
            const dto: DownloadConfigurationDto = responseDto.data as DownloadConfigurationDto;
            if(configDownloadCompleted(dto)) {
                this.webSocket.emit(WEB_SOCKET_INQUIRY_CHANNEL, responseDto);
                return;
            }
            this.messages.push(dto);
            const mergedDto: DownloadConfigurationDto = mergeConfigDownloadMessages(this.messages);
            if(configDownloadCompleted(mergedDto)) {
                this.webSocket.emit(WEB_SOCKET_INQUIRY_CHANNEL, {inquiryType: 'DOWNLOAD_CONFIGURATION', data: mergedDto} as SocketResponseDto);
            }
        } else {
            this.webSocket.emit(WEB_SOCKET_INQUIRY_CHANNEL, responseDto);
        }
    }

    private createPacket(opcode: number): Buffer {
        // Create the message by joining fields with the FS
        const messageFields = messageTemplates[opcode]?.(this.dto) ?? [];
        const bodyBuffer = Buffer.concat(
            messageFields.map(field =>
                Buffer.concat([Buffer.from(field + '', "utf8"), FS])
            )
        );

        return Buffer.concat([STX, bodyBuffer, ETX]);
    }

    private sendMessage(opcode: number): void {
        const message = this.createPacket(opcode);
        this.client.write(message);
        if(this.verbose) {
            console.log("\n\n==== Request ====");
            logBuffer(message);
        }
    }

    public disconnect(): void {
        this.client.destroy();
    }
}

