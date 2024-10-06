import dotenv from "dotenv";
dotenv.config();
import "node:process";
import log from "loglevel";
import app from "./app";
import { webSocketServer } from "./loyalty/webSocketServer";

log.setDefaultLevel("DEBUG");
const port: number = +process.env.EXPRESS_PORT!;
const wsPort: number = +process.env.WEB_SOCKET_PORT!;

webSocketServer.start(wsPort);

app.get("/", (req, res) => {
  return res.json({ status: "up" });
});

app.listen(port, () => {
  log.info(`Express server listening on port: ${port}`);
});
