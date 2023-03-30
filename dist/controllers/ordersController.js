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
exports.patchOrder = exports.getAllOrders = void 0;
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
                subtotal: order.subtotal,
                total: order.total,
                shippingInfo: {
                    name: order.name,
                    addressLineOne: order.addressLineOne,
                    addressLineTwo: order.addressLineTwo || null,
                    city: order.city,
                    state: order.state,
                    phoneNumber: order.phoneNumber,
                    paymentStatus: order.paymentStatus,
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
            return formattedOrder;
        });
        return res.status(200).json(formattedOrders);
    }
    catch (_a) {
        return res.status(400).json({ error: 'Error getting orders' });
    }
});
exports.getAllOrders = getAllOrders;
const patchOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, trackingNumber } = req.params;
    try {
        yield (0, db_1.default)('orders')
            .where({ id })
            .update({ trackingNumber });
        return res.status(200).json({
            message: 'order updated',
        });
    }
    catch (err) {
        return res.status(400).json({ err });
    }
});
exports.patchOrder = patchOrder;
