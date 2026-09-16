import express from "express";
import { upgradeUserToCirpyRed } from "../db/queries/users.js";
import { NotFoundError } from "../error_types.js";

export async function handlerPolkaWebhook(req: express.Request, res: express.Response) {
    const { event, data: { userId } } = req.body;
    console.log(event, userId);
    if (event !== "user.upgraded") {
        return res.status(204).send();
    } else {
        if (!userId) {
            return new NotFoundError("User not found");
        }
        const user = await upgradeUserToCirpyRed(userId);

        console.log("User upgraded to Chirpy Red:", user);

        if (!user) {
            return new NotFoundError("User not found");
        } else {
            return res.status(204).send();
        }
    }
}