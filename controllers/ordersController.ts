import { Request, Response } from 'express';
import db from '../db';
import { IItem, IItemHash } from '../utils/interfaces';

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await db('orders');
        const products = await db('products');
        const formattedOrders = orders.map((order) => {
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
    const { id, trackingNumber } = req.params;

    try {
        await db('orders')
                .where({id})
                .update({
                    trackingNumber,
                    isFulfilled: true
                });
        return res.status(200).json("Order updated").end();
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