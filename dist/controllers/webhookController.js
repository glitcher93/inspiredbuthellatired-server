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
    catch ({ message }) {
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }
    if (eventType === "checkout.session.completed") {
        try {
            const customer = yield stripe.customers.retrieve(data.customer);
            const items = JSON.parse(data.metadata.items);
            const itemIds = items.map((item) => item.id);
            const quantities = items.map((item) => item.quantity);
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
            };
            try {
                yield (0, db_1.default)('orders').insert(newOrder);
                return res.status(201).json({ message: 'Order created' });
            }
            catch ({ message }) {
                res.status(400).send(`Webhook Error: ${message}`);
                return;
            }
        }
        catch ({ message }) {
            res.status(400).send(`Webhook Error: ${message}`);
            return;
        }
    }
});
exports.webhook = webhook;
