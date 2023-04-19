"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const transporter = (0, nodemailer_1.createTransport)({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PW
    }
});
const handlebarOptions = {
    viewEngine: {
        partialsDir: path_1.default.resolve('./email-templates/'),
        defaultLayout: false,
        helpers: {
            convertPrice: (priceInCents) => {
                const price = Number(priceInCents) / 100;
                return price.toFixed(2);
            },
            calculateTotal: (priceInCents, quantity) => {
                const price = Number(priceInCents) / 100;
                return (price * quantity).toFixed(2);
            }
        }
    },
    viewPath: path_1.default.resolve('./email-templates/'),
};
transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
exports.default = transporter;
