import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';
import path from "path";

dotenv.config();

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PW
    }
});

const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
        partialsDir: path.resolve('./email-templates/'),
        defaultLayout: false,
        helpers: {
            convertPrice: (priceInCents) => {
                const price = Number(priceInCents) / 100;

                return price.toFixed(2)
            },
            calculateTotal: (priceInCents, quantity) => {
                const price = Number(priceInCents) / 100;

                return (price * quantity).toFixed(2)
            }
        }
    },
    viewPath: path.resolve('./email-templates/'),
}

transporter.use('compile', hbs(handlebarOptions));

export default transporter;