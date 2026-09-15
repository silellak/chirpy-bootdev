import express from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth/auth.js";
import { NewUser } from "../db/schema.js";
import { UnauthorizedError } from "../error_types.js";
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: express.Request, res: express.Response) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return new UnauthorizedError("Email and password are required");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({ email : email, hashedPassword : hashedPassword });
    const { hashedPassword: _, ...newUserReturned } = newUser;
    console.log("New user created:", newUserReturned);
    return res.status(201).type("application/json").send(JSON.stringify(newUserReturned));
}

export async function handlerUpdateUser(req: express.Request, res: express.Response) {
    const jwtToken = getBearerToken(req);
    const userId = await validateJWT(jwtToken || "", config.tokenSecret);

    if (userId == null) {
        throw new UnauthorizedError("Invalid or missing JWT token");
    }

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return new UnauthorizedError("Email and password are required");
    }

    let hashedPassword;
    if (password) {
        hashedPassword = await hashPassword(password);
    }

    const updatedUser = await updateUser(userId, { email, hashedPassword });
    const { hashedPassword: _, ...updatedUserReturned } = updatedUser;
    console.log("User updated:", updatedUserReturned);
    return res.status(200).type("application/json").send(JSON.stringify(updatedUserReturned));
}