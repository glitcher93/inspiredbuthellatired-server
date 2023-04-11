"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.addTracking = exports.getOrderById = exports.getRecentOrders = exports.getAllOrders = void 0;
const db_1 = __importDefault(require("../db"));
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, db_1.default)('orders');
        const products = yield (0, db_1.default)('products');
        const formattedOrders = orders.map((order) => {
            const formattedProducts = [];
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
            };
            const itemHash = {};
            let itemQuantity;
            order.products.forEach((productId, index) => {
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
                        };
                        formattedProducts.push(formattedProduct);
                    }
                }
            });
            return formattedOrder;
        });
        return res.status(200).json(formattedOrders).end();
    }
    catch (_a) {
        return res.status(400).json({ error: 'Error getting orders' }).end();
    }
});
exports.getAllOrders = getAllOrders;
const getRecentOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, db_1.default)('orders');
        const products = yield (0, db_1.default)('products');
        const formattedOrders = orders.map((order) => {
            const formattedProducts = [];
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
            };
            const itemHash = {};
            let itemQuantity;
            order.products.forEach((productId, index) => {
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
                        };
                        formattedProducts.push(formattedProduct);
                    }
                }
            });
            return formattedOrder;
        });
        return res.status(200).json(formattedOrders).end();
    }
    catch (err) {
        return res.status(400).send("Error retrieving orders").end();
    }
});
exports.getRecentOrders = getRecentOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const orders = yield (0, db_1.default)('orders').where({ orderId });
        const order = orders[0];
        const products = yield (0, db_1.default)('products');
        const formattedProducts = [];
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
        };
        const itemHash = {};
        let itemQuantity;
        order.products.forEach((productId, index) => {
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
                    };
                    formattedProducts.push(formattedProduct);
                }
            }
        });
        return res.status(200).json(formattedOrder).end();
    }
    catch (_b) {
        return res.status(400).json({ error: 'Error getting orders' }).end();
    }
});
exports.getOrderById = getOrderById;
const addTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { trackingNumber } = req.body;
    try {
        yield (0, db_1.default)('orders')
            .where({ id })
            .update({
            trackingNumber,
            isFulfilled: true
        });
        return res.status(200).json("Order updated").end();
    }
    catch (err) {
        return res.status(400).json({ err }).end();
    }
});
exports.addTracking = addTracking;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const orders = yield (0, db_1.default)('orders').where({ id });
        const order = orders[0];
        if (order.trackingNumber && order.isFulfilled) {
            yield (0, db_1.default)('orders').delete().where({ id });
            return res.status(200).send("Order deleted").end();
        }
        else {
            return res.status(404).send("Order does not have a tracking number and is not fulfilled").end();
        }
    }
    catch (err) {
        return res.status(404).send("Order not found").end();
    }
});
exports.deleteOrder = deleteOrder;
