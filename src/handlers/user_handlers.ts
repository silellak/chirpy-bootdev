import express from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth/auth.js";
import { NewUser } from "../db/schema.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: express.Request, res: express.Response) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).type("application/json").send(JSON.stringify({ error: "Email and password are required" }));
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({ email : email, hashedPassword : hashedPassword });
    const { hashedPassword: _, ...newUserReturned } = newUser;
    console.log("New user created:", newUserReturned);
    return res.status(201).type("application/json").send(JSON.stringify(newUserReturned));
}