import { Request, Response } from 'express';
import db from '../db';
import { IItem, IItemHash } from '../utils/interfaces';
import Stripe from "stripe";
import dotenv from 'dotenv';
import transporter from '../utils/transporter';
import { Options } from 'nodemailer/lib/mailer';
import { TemplateOptions } from 'nodemailer-express-handlebars';

dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(secretKey, { apiVersion: "2022-11-15" });

const serverURL = process.env.SERVER_URL as string || 'http://localhost:8080'

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await db('orders');
        const products = await db('products');
        const formattedOrders = orders.map((order) => {
            const formattedProducts: IItem[] = [];
            const formattedOrder = {
                id: order.id,
                orderId: order.orderId,
                paymentIntentId: order.paymentIntentId,
                paymentStatus: order.paymentStatus,
                subtotal: order.subtotal,
                total: order.total,
                shippingInfo: {
                    name: order.name,
                    addressLineOne: order.addressLineOne,
                    addressLineTwo: order.addressLineTwo || null,
                    city: order.city,
                    state: order.state,
                    postalCode: order.postalCode,
                    phoneNumber: order.phoneNumber,
                    trackingNumber: order.trackingNumber || null,
                    isFulfilled: order.isFulfilled,
                    createdAt: order.createdAt
                },
                items: formattedProducts
            }
            const itemHash: IItemHash = {};
            let itemQuantity: number;
            order.products.forEach((productId: string, index: number) => {
                const foundProduct = products.find((product) => product.id === productId);
                if (order.quantities[index]) {
                    itemQuantity = order.quantities[index];
                }
                if (foundProduct) {
                    itemHash[foundProduct.id] = foundProduct;
                    const currentProduct = itemHash[foundProduct.id];
                    
                    if (currentProduct) {
                        const formattedProduct = {
                            id: currentProduct.id,
                            image: currentProduct.image,
                            title: currentProduct.title,
                            priceInCents: currentProduct.priceInCents,
                            size: currentProduct.size,
                            type: currentProduct.type,
                            quantity: itemQuantity
                        }
                        formattedProducts.push(formattedProduct);
                    }
                }
            })
            return formattedOrder;
        });
        return res.status(200).json(formattedOrders).end();
    } catch {
        return res.status(400).json({error: 'Error getting orders'}).end();
    }
}

export const getRecentOrders = async (req: Request, res: Response) => {
    try {
        const orders = await db('orders');
        const products = await db('products');
        const formattedOrders = orders.map((order) => {
            const formattedProducts: IItem[] = [];
            const formattedOrder = {
                id: order.id,
                orderId: order.orderId,
                subtotal: order.subtotal,
                paymentIntentId: order.paymentIntentId,
                paymentStatus: order.paymentStatus,
                total: order.total,
                shippingInfo: {
                    name: order.name,
                    addressLineOne: order.addressLineOne,
                    addressLineTwo: order.addressLineTwo || null,
                    city: order.city,
                    state: order.state,
                    postalCode: order.postalCode,
                    phoneNumber: order.phoneNumber,
                    trackingNumber: order.trackingNumber || null,
                    isFulfilled: order.isFulfilled,
                    createdAt: order.createdAt
                },
                items: formattedProducts
            }
            const itemHash: IItemHash = {};
            let itemQuantity: number;
            order.products.forEach((productId: string, index: number) => {
                const foundProduct = products.find((product) => product.id === productId);
                if (order.quantities[index]) {
                    itemQuantity = order.quantities[index];
                }
                if (foundProduct) {
                    itemHash[foundProduct.id] = foundProduct;
                    const currentProduct = itemHash[foundProduct.id];
                    
                    if (currentProduct) {
                        const formattedProduct = {
                            id: currentProduct.id,
                            image: currentProduct.image,
                            title: currentProduct.title,
                            priceInCents: currentProduct.priceInCents,
                            size: currentProduct.size,
                            type: currentProduct.type,
                            quantity: itemQuantity
                        }
                        formattedProducts.push(formattedProduct);
                    }
                }
            })
            return formattedOrder;
        });
        return res.status(200).json(formattedOrders).end();
    } catch (err) {
        return res.status(400).send("Error retrieving orders").end()
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    try {
        const orders = await db('orders').where({orderId});
        const order = orders[0];
        const products = await db('products');
        const formattedProducts: IItem[] = [];
        const formattedOrder = {
            id: order.id,
            orderId: order.orderId,
            paymentStatus: order.paymentStatus,
            subtotal: order.subtotal,
            total: order.total,
            shippingInfo: {
                name: order.name,
                addressLineOne: order.addressLineOne,
                addressLineTwo: order.addressLineTwo || null,
                city: order.city,
                state: order.state,
                postalCode: order.postalCode,
                phoneNumber: order.phoneNumber,
                trackingNumber: order.trackingNumber || null,
                createdAt: order.createdAt
            },
            items: formattedProducts
        }
        const itemHash: IItemHash = {};
        let itemQuantity: number;
            order.products.forEach((productId: string, index: number) => {
                const foundProduct = products.find((product) => product.id === productId);
                if (order.quantities[index]) {
                    itemQuantity = order.quantities[index];
                }
                if (foundProduct) {
                    itemHash[foundProduct.id] = foundProduct;
                    const currentProduct = itemHash[foundProduct.id];
                    
                    if (currentProduct) {
                        const formattedProduct = {
                            id: currentProduct.id,
                            image: currentProduct.image,
                            title: currentProduct.title,
                            priceInCents: currentProduct.priceInCents,
                            size: currentProduct.size,
                            type: currentProduct.type,
                            quantity: itemQuantity
                        }
                        formattedProducts.push(formattedProduct);
                    }
                }
            })
        return res.status(200).json(formattedOrder).end();
    } catch {
        return res.status(400).json({error: 'Error getting orders'}).end();
    }
}

export const addTracking = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { trackingNumber, serviceProvider } = req.body;

    try {
        await db('orders')
                .where({id})
                .update({
                    trackingNumber,
                    serviceProvider,
                    isFulfilled: true
                });

        const order = await db('orders').where({id});

        const foundOrder = order[0];

        const mailOptions: Options & TemplateOptions = {
            from: '"Inspiredbuthellatired" <inspiredbuthellatired@gmail.com>',
            to: foundOrder.email,
            bcc: 'alyssamallone@hotmail.com',
            subject: `Tracking Info for Order #${foundOrder.orderId}`,
            template: 'tracking_info',
            context: {
                logo: `${serverURL}/images/logo.webp`,
                trackingNumber,
                serviceProvider
            }
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            return res.status(200).json("Order updated").end();
        })
    } catch (err) {
        return res.status(400).json({err}).end();
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const orders = await db('orders').where({id})
        const order = orders[0]

        if (order.trackingNumber && order.isFulfilled) {
            await db('orders').delete().where({id})
            return res.status(200).send("Order deleted").end();
        } else {
            return res.status(404).send("Order does not have a tracking number and is not fulfilled").end();
        }
    } catch (err) {
        return res.status(404).send("Order not found").end()
    }
}

export const cancelOrder = async (req: Request, res: Response) => {
    const { paymentIntentId } = req.body;

    await stripe.refunds.create({payment_intent: paymentIntentId});

    return res.status(200).json({canceled: true}).end();
}