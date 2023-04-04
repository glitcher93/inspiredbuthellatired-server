import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import db from "../db";

dotenv.config();

const clientUrl = process.env.CLIENT_URL as string;

const validOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    try {
        const orders = await db('orders').where({orderId});
        if (orders.length > 0) {
            next();
        } else {
            return res.status(302).json({
                url: `${clientUrl}/`
            })
        }
    } catch (err) {
        return res.status(302).json({
            url: `${clientUrl}/`
        })
    }
}

export default validOrder;