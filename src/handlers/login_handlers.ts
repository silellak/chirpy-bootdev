import express from "express";
import { checkPasswordHash, makeJWT } from "../auth/auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError } from "../error_types.js";

const incorrectEmailPasswordMessage = "incorrect email or password";

export async function handlerLogin(req: express.Request, res: express.Response) {
    const email = req.body.email;
    const password = req.body.password;
    let expiresInSeconds = req.body.expiresInSeconds || 3600; // Default to 1 hour if not provided
    if (req.body.expiresInSeconds > 3600) {
        expiresInSeconds = 3600; // Cap the expiration time to 1 hour
    }

    if (!email || !password) {
        throw new BadRequestError("Email and password are required");
    }

    const user = await getUserByEmail(email);

    if (!user) {
        throw new BadRequestError(incorrectEmailPasswordMessage);
    }

    const isPasswordValid = await checkPasswordHash(password, user.hashedPassword);

    if (!isPasswordValid) {
        throw new UnauthorizedError(incorrectEmailPasswordMessage);
    }

    const token = makeJWT(user.id, expiresInSeconds, config.tokenSecret);

    const { hashedPassword: _, ...returnedUser } = user;
    console.log("User logged in:", returnedUser);
    return res.status(200).type("application/json").send(JSON.stringify({ ...returnedUser, token }));
}