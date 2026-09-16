import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
  const result = await db.select().from(chirps).orderBy(chirps.createdAt);
  return result;
}

export async function getChirpById(id: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, id)).limit(1);
  return result[0];
}

export async function deleteChirpById(id: string) {
  const result = await db.delete(chirps).where(eq(chirps.id, id)).returning();
  return result[0];
}