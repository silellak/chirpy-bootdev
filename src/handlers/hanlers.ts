import express from "express";
import { apiConfig } from "../config.js";

export function handlerReadiness(_req: express.Request, res: express.Response) {
  res.status(200).type("text/plain").send("OK");
}

export function handlerRequestCount(_req: express.Request, res: express.Response) {
  return res.status(200).type("text/plain").send(`Hits: ${apiConfig.fileserverHits}`);
}

export function handlerResetMetrics(_req: express.Request, res: express.Response) {
  apiConfig.fileserverHits = 0;
  return res.status(200).type("text/plain").send("Metrics reset");
}