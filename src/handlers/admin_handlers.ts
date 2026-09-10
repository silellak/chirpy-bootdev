import express from "express";
import { apiConfig } from "../config.js";
import { BadRequestError } from "../error_types.js";
import { deleteAllUsers } from "../db/queries/users.js";

export type ChirpParameters = {
  body: string;
};

export function handlerReadiness(_req: express.Request, res: express.Response) {
  res.status(200).type("text/plain").send("OK");
}

export function handlerResetMetrics(_req: express.Request, res: express.Response) {
  apiConfig.fileserverHits = 0;
  if (apiConfig.platform?.toUpperCase() === "DEV") {
    deleteAllUsers();

    res.status(200).type("text/plain").send("Metrics reset");
  } else {
    res.status(403).type("text/plain").send("Forbidden");
  }
}

export function handlerRequestCount(_req: express.Request, res: express.Response) {
  const adminMetricsTemplate = `<html>
    <body>
      <h1>Welcome, Chirpy Admin</h1>
      <p>Chirpy has been visited ${apiConfig.fileserverHits} times!</p>
    </body>
  </html>`;

  return res.status(200).type("text/html;charset=utf-8").send(adminMetricsTemplate);
}