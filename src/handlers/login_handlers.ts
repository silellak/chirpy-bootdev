import express from "express";
import { checkPasswordHash } from "../auth/auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { UserResponse } from "./user_handlers.js";

const incorrectEmailPasswordMessage = "incorrect email or password";

export async function handlerLogin(req: express.Request, res: express.Response) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).type("application/json").send(JSON.stringify({ error: "Email and password are required" }));
    }

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(401).type("application/json").send(JSON.stringify({ error: incorrectEmailPasswordMessage }));
    }

    const isPasswordValid = await checkPasswordHash(password, user.hashedPassword);

    if (!isPasswordValid) {
        return res.status(401).type("application/json").send(JSON.stringify({ error: incorrectEmailPasswordMessage }));
    }

    const { hashedPassword: _, ...returnedUser } = user;
    console.log("User logged in:", returnedUser);
    return res.status(200).type("application/json").send(JSON.stringify(returnedUser));
}