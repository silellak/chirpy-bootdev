import express from "express";
import { BadRequestError, UnauthorizedError } from "../error_types.js";
import { createChirp, getChirpById, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth/auth.js";
import { config } from "../config.js";

export type ChirpParameters = {
  body: string;
};

export const prohibitedWords: string[] = ["kerfuffle", "sharbert", "fornax"];

export async function handlerCreateChirp(req: express.Request, res: express.Response) {
    const jwtToken = getBearerToken(req);
    const tokenUser = validateJWT(jwtToken || "", config.tokenSecret);

    if (!tokenUser) {
        throw new UnauthorizedError("Invalid or missing JWT token");
    }

    const chirp = req.body;

    if (chirp.body && chirp.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }

    for (const word of prohibitedWords) {
        chirp.body = chirp.body.replace(new RegExp(word, "gi"), "****");
    }

    chirp.userId = tokenUser; // Associate the chirp with the user from the JWT

    const newChirp = await createChirp(chirp);

    // Here you would typically save the chirp to a database or perform other operations
    return res.status(201).type("application/json").send(JSON.stringify(newChirp));
}

export async function handlerGetChirps(req: express.Request, res: express.Response) {
    const chirps = await getChirps();
    return res.status(200).type("application/json").send(JSON.stringify(chirps));
}

export async function handleGetChirpById(req: express.Request, res: express.Response) {
    const { chirpId } = req.params;
    
    if (typeof chirpId !== "string") {
        throw new BadRequestError("Invalid chirp ID");
    }
    const chirp = await getChirpById(chirpId);

    if (!chirp) {
        throw new BadRequestError("Chirp not found");
    }

    return res.status(200).type("application/json").send(JSON.stringify(chirp));
}