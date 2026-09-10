import express from "express";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: express.Request, res: express.Response) {
    const email = req.body.email;
    const newUser = await createUser({ email : email});
    return res.status(201).type("application/json").send(JSON.stringify(newUser));
}