import express from "express";
import { BadRequestError } from "../error_types.js";
import { createChirp } from "../db/queries/chirps.js";

export type ChirpParameters = {
  body: string;
};

export const prohibitedWords: string[] = ["kerfuffle", "sharbert", "fornax"];

export async function handlerCreateChirp(req: express.Request, res: express.Response) {
    const chirp = req.body;

    if (chirp.body && chirp.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    for (const word of prohibitedWords) {
        chirp.body = chirp.body.replace(new RegExp(word, "gi"), "****");
    }

    const newChirp = await createChirp(chirp);

    // Here you would typically save the chirp to a database or perform other operations
    return res.status(201).type("application/json").send(JSON.stringify(newChirp));
}