import express from "express";
import { apiConfig } from "../config.js";

export type ChirpParameters = {
  body: string;
};

export const prohibitedWords: string[] = ["kerfuffle", "sharbert", "fornax"];

export function handlerReadiness(_req: express.Request, res: express.Response) {
  res.status(200).type("text/plain").send("OK");
}

export function handlerResetMetrics(_req: express.Request, res: express.Response) {
  apiConfig.fileserverHits = 0;
  return res.status(200).type("text/plain").send("Metrics reset");
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

export function handlerValidateChirp(req: express.Request, res: express.Response) {
  const chirp: ChirpParameters = req.body;

  try {
      if (chirp.body && chirp.body.length > 140) {
        return res.status(400).type("application/json").send(JSON.stringify({
          "error": "Chirp is too long"
        }));
      }

      for (const word of prohibitedWords) {
        chirp.body = chirp.body.replace(new RegExp(word, "gi"), "****");
      }

      return res.status(200).type("application/json").send(JSON.stringify({
        "cleanedBody": chirp.body
      }));
    } catch (error) {
      const body = JSON.stringify({
        "error": "Something went wrong"
      });
      return res.status(400).type("application/json").send(body);
    }
}