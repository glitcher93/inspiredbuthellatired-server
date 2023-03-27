import { NextFunction, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IRequest } from '../utils/interfaces';

dotenv.config();

const secret = process.env.JWT_SECRET as Secret;

const auth = (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(403).json({
            message: "No token, access denied"
        })
    }
    const token = req.headers.authorization!.split(' ')[1];
    try {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Token is expired or invalid"
                });
            }
            req.payload = decoded;
            next();
        })
    } catch {
        return res.status(401).json({
            message: "Token is expired or invalid"
        })
    }
}

export default auth;