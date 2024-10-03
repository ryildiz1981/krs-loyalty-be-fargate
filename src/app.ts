import express from "express";
import cors from "cors";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
app.use(cors());
app.use(express.json());

app.options("*", cors());

export default app;
