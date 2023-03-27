import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import db from '../db';
import { IItem } from '../utils/interfaces';

dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY as string;

const webhookSecret = process.env.WEBHOOK_SECRET as string

const stripe = new Stripe(secretKey, { apiVersion: '2022-11-15' });

export const webhook = async (req: Request, res: Response) => {

    const sig = req.headers['stripe-signature'] as string;

    let event;
    let data;
    let eventType;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        data = event.data.object as any;
        eventType = event.type;
    } catch ({ message }) {
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }

    if (eventType === "checkout.session.completed") {
        try {
            const customer = await stripe.customers.retrieve(data.customer) as Stripe.Customer;
            
            const items = JSON.parse(data.metadata.items);

            const itemIds: string = items.map((item: IItem) => item.id);
            const quantities: number = items.map((item: IItem) => item.quantity);

            const newOrder = {
                userId: customer.metadata.userId,
                customerId: data.customer,
                paymentIntentId: data.payment_intent,
                products: itemIds,
                quantities,
                subtotal: data.amount_subtotal,
                total: data.amount_total,
                name: data.shipping.name,
                addressLineOne: data.shipping.address.line1,
                addressLineTwo: data.shipping.address.line2,
                city: data.shipping.address.city,
                state: data.shipping.address.state,
                phoneNumber: data.shipping.phone,
                paymentStatus: data.payment_status
            }

            try {
                await db('orders').insert(newOrder);
                return res.status(201).json({ message: 'Order created' });
            } catch ({ message }) {
                res.status(400).send(`Webhook Error: ${message}`);
                return;
            }

        } catch ({ message }) {
            res.status(400).send(`Webhook Error: ${message}`);
            return;
        }
    }
}