import { Request, Response } from 'express';
import db from '../db';

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await db('orders');
        return res.status(200).json(orders);
    } catch {
        return res.status(400).json({error: 'Error getting orders'})
    }
}

export const patchOrder = async (req: Request, res: Response) => {
    const { id, trackingNumber } = req.params;

    try {
        await db('orders')
                .where({id})
                .update({trackingNumber});
        return res.status(200).json({
            message: 'order updated',
        });
    } catch (err) {
        return res.status(400).json({err})
    }
}