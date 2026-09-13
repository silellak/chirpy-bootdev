import * as argon2 from "argon2";import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import express from "express";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, { type: argon2.argon2id });
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    return jwt.sign(payload, secret);
}

export function validateJWT(token: string, secret: string): string | null {
    try {
        const decoded = jwt.verify(token, secret) as payload;
        return decoded?.sub || null;
    } catch (error) {
        console.error("JWT validation error:", error);
        return null;
    }
}

export function getBearerToken(req: express.Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }
    return parts[1];
}