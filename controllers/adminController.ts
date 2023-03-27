import { Request, Response } from "express";
import db from '../db';
import jwt, { Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET as Secret;

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const users = await db('admin');

        const foundUser = users.find(user => user.email === email);
        const passwordMatches = bcrypt.compareSync(password, foundUser.password);

        if (!foundUser) {
            res.status(404).send("User not found");
        }
        if (foundUser && !passwordMatches) {
            res.status(401).send("Incorrect password, try again.");
        }
        if (foundUser && passwordMatches) {
            const payload = {
                id: foundUser.id,
                email: foundUser.email
            }
            const token = jwt.sign(payload, secret);
            res.status(200).json({
                token
            });
        }
    } catch {
        res.status(401).json({
            message: "Invalid email or password"
        })
    }
}