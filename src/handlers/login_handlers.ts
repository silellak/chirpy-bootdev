import express from "express";
import { checkPasswordHash, getRefreshToken, makeJWT, makeRefreshToken } from "../auth/auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError } from "../error_types.js";
import { getRefreshTokenByToken, insertRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";

const incorrectEmailPasswordMessage = "incorrect email or password";

export async function handlerLogin(req: express.Request, res: express.Response) {
    const email = req.body.email;
    const password = req.body.password;
    let expiresInSeconds = 3600;

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

    const refreshToken = makeRefreshToken()
    await insertRefreshToken(refreshToken, user.id, new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // Expires in 60 days
    const token = makeJWT(user.id, expiresInSeconds, config.tokenSecret);

    const { hashedPassword: _, ...returnedUser } = user;
    console.log("User logged in:", { ...returnedUser, token, refreshToken });
    return res.status(200).type("application/json").send(JSON.stringify({ ...returnedUser, token, refreshToken }));
}

export async function handlerRefresh(req: express.Request, res: express.Response) {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
        throw new BadRequestError("Refresh token is required");
    }

    const tokenInDatabase = await getRefreshTokenByToken(refreshToken);

    if (!tokenInDatabase) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    if (tokenInDatabase.expiresAt < new Date()) {
        throw new UnauthorizedError("Refresh token has expired");
    }

    if (tokenInDatabase.revokedAt) {
        throw new UnauthorizedError("Refresh token has been revoked");
    }

    const newJwt = makeJWT(tokenInDatabase.userId, 3600, config.tokenSecret);

    return res.status(200).type("application/json").send(JSON.stringify({ token: newJwt }));
}

export async function handlerRevokeRefreshToken(req: express.Request, res: express.Response) {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
        throw new BadRequestError("Refresh token is required");
    }

    const tokenInDatabase = await getRefreshTokenByToken(refreshToken);

    if (!tokenInDatabase) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    await revokeRefreshToken(tokenInDatabase.token);

    return res.status(204).send();
}