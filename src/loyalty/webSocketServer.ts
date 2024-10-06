import log from "loglevel";

import { createServer } from "http";
import { Server } from "socket.io";
import { TerminalClient } from "./terminalClient";
import {
  LoyaltyDto,
  WEB_SOCKET_INQUIRY_CHANNEL,
  WEB_SOCKET_COMMUNICATION_SECRET,
  WEB_SOCKET_RECEIPT_CHANNEL,
} from "./loyaltyInterface";
import { Socket } from "socket.io/dist/socket";
import { ReceiptPrintRequestDto } from "./receipt/receiptline/markdown/ReceiptMarkdownInterface";
import { receiptService } from "./receipt/receiptline/print/ReceiptService";
import * as process from "node:process";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.use((socket: any, next) => {
  if (WEB_SOCKET_COMMUNICATION_SECRET !== socket.handshake.auth.token) {
    next(new Error("Unauthorized: Invalid Secret"));
  } else {
    return next();
  }
}).on("connection", (webSocket: Socket) => {
  webSocket.on(WEB_SOCKET_INQUIRY_CHANNEL, (dto: LoyaltyDto) => {
    if (process.env.USE_TEST_CARD_NUMBER && process.env.TEST_CARD_NUMBER) {
      dto.cardNumber = process.env.TEST_CARD_NUMBER;
    }
    new TerminalClient(webSocket, dto).handle();
  });
  webSocket.on(
    WEB_SOCKET_RECEIPT_CHANNEL,
    (printDto: ReceiptPrintRequestDto) => {
      if (process.env.USE_TEST_CARD_NUMBER && process.env.TEST_CARD_NUMBER) {
        printDto.cardNumber = process.env.TEST_CARD_NUMBER;
      }
      webSocket.emit(
        WEB_SOCKET_RECEIPT_CHANNEL,
        receiptService.createReceipt(printDto)
      );
    }
  );
  webSocket.on("disconnect", () => {
    console.log("disconnected");
  });
});

class WebSocketServer {
  start = (port: any) => {
    httpServer.listen(port, () => {
      log.info(`KRS Web Socket server is listening on port: ${port}`);
    });
  };
  close = () => {
    io.close();
  };
  emit = (channel: string, message: any) => io.emit(channel, message);
}

export const webSocketServer = new WebSocketServer();
