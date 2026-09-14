import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { refreshTokens } from "../schema.js";

export async function insertRefreshToken(token: string, userId: string, expiresAt: Date) {
    const newRefreshToken = await db.insert(refreshTokens).values({
        token,
        userId,
        expiresAt,
    }).returning();
    return newRefreshToken[0];
}

export async function getRefreshTokenByToken(token: string) {
    const refreshToken = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token)).limit(1);
    return refreshToken[0] || null;
}

export async function revokeRefreshToken(token: string) {
    const revokedAt = new Date();
    const updatedRefreshToken = await db.update(refreshTokens)
        .set({ revokedAt })
        .where(eq(refreshTokens.token, token))
        .returning();
    return updatedRefreshToken[0] || null;
}