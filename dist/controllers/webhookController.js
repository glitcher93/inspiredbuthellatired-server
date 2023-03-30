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
exports.webhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../db"));
dotenv_1.default.config();
const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.WEBHOOK_SECRET;
const stripe = new stripe_1.default(secretKey, { apiVersion: '2022-11-15' });
const webhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    let event;
    let data;
    let eventType;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        data = event.data.object;
        eventType = event.type;
    }
    catch (err) {
        return res.status(400).json(err);
    }
    if (eventType === "checkout.session.completed") {
        try {
            const customer = yield stripe.customers.retrieve(data.customer);
            const items = JSON.parse(customer.metadata.cart);
            const itemIds = items.map((item) => item.id);
            const quantities = items.map((item) => item.quantity);
            const newOrder = {
                orderId: customer.metadata.orderId,
                customerId: data.customer,
                paymentIntentId: data.payment_intent,
                products: itemIds,
                quantities,
                subtotal: data.amount_subtotal,
                total: data.amount_total,
                name: data.customer_details.name,
                addressLineOne: data.customer_details.address.line1,
                addressLineTwo: data.customer_details.address.line2,
                city: data.customer_details.address.city,
                state: data.customer_details.address.state,
                phoneNumber: data.customer_details.phone,
                paymentStatus: data.payment_status
            };
            try {
                yield (0, db_1.default)('orders').insert(newOrder);
                items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                    if (item.type === 'Painting') {
                        try {
                            yield (0, db_1.default)('products').where({ id: item.id }).update({ inStock: false });
                            res.status(200).json({ received: true }).end();
                        }
                        catch (err) {
                            return res.status(400).json(err);
                        }
                    }
                }));
            }
            catch (err) {
                return res.status(400).json(err);
            }
        }
        catch (err) {
            return res.status(400).json(err);
        }
    }
});
exports.webhook = webhook;
