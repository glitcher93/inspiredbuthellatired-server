import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import db from '../db';
import { IItem } from '../utils/interfaces';
import { Options } from 'nodemailer/lib/mailer';
import { TemplateOptions } from 'nodemailer-express-handlebars';
import transporter from '../utils/transporter';

dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY as string;

const webhookSecret = process.env.WEBHOOK_SECRET as string;

const serverURL = process.env.SERVER_URL as string || 'http://localhost:8080';

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
    } catch (err) {
        return res.status(400).json(err);
    }

    if (eventType === "checkout.session.completed") {
        try {
            const customer = await stripe.customers.retrieve(data.customer) as Stripe.Customer;
            
            const items = JSON.parse(customer.metadata.cart);

            const itemIds: string = items.map((item: IItem) => item.id);
            const quantities: number = items.map((item: IItem) => item.quantity);

            const newOrder = {
                orderId: customer.metadata.orderId,
                customerId: data.customer,
                paymentIntentId: data.payment_intent,
                products: itemIds,
                quantities,
                subtotal: data.amount_subtotal,
                total: data.amount_total,
                name: data.customer_details.name,
                email: data.customer_details.email,
                addressLineOne: data.customer_details.address.line1,
                addressLineTwo: data.customer_details.address.line2,
                city: data.customer_details.address.city,
                state: data.customer_details.address.state,
                postalCode: data.customer_details.address.postal_code,
                phoneNumber: data.customer_details.phone,
                paymentStatus: data.payment_status
            }

            try {
                await db('orders').insert(newOrder);
                items.forEach(async (item: IItem) => {
                    if (item.type === 'Painting') {
                        try {
                            await db('products').where({id: item.id}).update({inStock: false});
                        } catch (err) {
                            return res.status(400).json(err);
                        }
                    }
                })

                const mailOptions: Options & TemplateOptions = {
                    from: '"Inspiredbuthellatired" <inspiredbuthellatired@gmail.com>',
                    to: data.customer_details.email,
                    bcc: 'alyssamallone@hotmail.com',
                    subject: `Thank You for Your Purchase! (Order #${customer.metadata.orderId})`,
                    template: 'successful_purchase',
                    context: {
                        items,
                        logo: `${serverURL}/images/logo.webp`,
                        orderId: customer.metadata.orderId,
                        name: data.customer_details.name,
                        email: data.customer_details.email,
                        addressLineOne: data.customer_details.address.line1,
                        addressLineTwo: data.customer_details.address.line2,
                        city: data.customer_details.address.city,
                        state: data.customer_details.address.state,
                        postalCode: data.customer_details.address.postal_code,
                        phoneNumber: data.customer_details.phone,
                        total: data.amount_total
                    }
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                    }
                    res.status(200).json({received: true}).end()
                })
            } catch (err) {
                return res.status(400).json(err);
            }
        } catch (err) {
            return res.status(400).json(err);
        }
    }

    if (eventType === 'charge.refunded') {
        try {
            const paymentIntentId = data.payment_intent;

            const order = await db("orders").where({paymentIntentId});

            const foundOrder = order[0];

            const mailOptions: Options & TemplateOptions = {
                from: '"Inspiredbuthellatired" <inspiredbuthellatired@gmail.com>',
                to: data.customer_details.email,
                bcc: 'alyssamallone@hotmail.com',
                subject: `Order #${foundOrder.orderId} Cancelled and Refunded`,
                template: 'successful_refund',
                context: {
                    logo: `${serverURL}/images/logo.webp`
                }
            }
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error)
                }
                await db("orders").delete().where({paymentIntentId});
                res.status(200).json({canceled: true}).end()
            })
        } catch (err) {
            return res.status(400).json(err);
        }
    }
}