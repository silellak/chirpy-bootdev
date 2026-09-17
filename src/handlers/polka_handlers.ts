import express from "express";
import { upgradeUserToCirpyRed } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../error_types.js";
import { getAPIKey } from "../auth/auth.js";
import { config } from "../config.js";

export async function handlerPolkaWebhook(req: express.Request, res: express.Response) {
    const apiKey = getAPIKey(req);
    console.log("Received API key:", apiKey);
    if (!apiKey || apiKey !== config.api.polkaKey) {
        console.error("Invalid API key:", apiKey);
        throw new UnauthorizedError("Invalid API key");
    }

    const { event, data: { userId } } = req.body;
    console.log(event, userId);
    if (event !== "user.upgraded") {
        return res.status(204).send();
    } else {
        
        if (!userId) {
            throw new NotFoundError("User not found");
        }
        const user = await upgradeUserToCirpyRed(userId);

        console.log("User upgraded to Chirpy Red:", user);

        if (!user) {
            throw new NotFoundError("User not found");
        } else {
            return res.status(204).send();
        }
    }
}