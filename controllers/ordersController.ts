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
                    paymentStatus: order.paymentStatus,
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
            return formattedOrder;
        });
        return res.status(200).json(formattedOrders);
    } catch {
        return res.status(400).json({error: 'Error getting orders'})
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
                paymentStatus: order.paymentStatus,
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
        return res.status(200).json(formattedOrder);
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