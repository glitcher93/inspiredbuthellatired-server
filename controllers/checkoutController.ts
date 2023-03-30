import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import orderId from "order-id";

dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(secretKey, { apiVersion: "2022-11-15" });

export const checkout = async (req: Request, res: Response) => {

    const { items } = req.body;

    const orderNumber = orderId(process.env.ORDER_ID_SECRET as string).generate();

    const customer = await stripe.customers.create({
        metadata: {
            orderId: orderNumber,
            cart: JSON.stringify(items)
        }
    });

    const line_items = items.map((item: any) => {
        return {
            price_data: {
                currency: "cad",
                product_data: {
                    name: item.title,
                    description: `${item.type} - ${item.size}`,
                    images: [item.image],
                    metadata: {
                        id: item.id,
                        size: item.size
                    }
                },
                unit_amount: item.priceInCents,
            },
            quantity: item.quantity,
        };
    })

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            phone_number_collection: {
                enabled: true
            },
            customer: customer.id,
            line_items,
            shipping_address_collection: {
                allowed_countries: ['AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'],
            },
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        return res.status(200).json({ url: session.url });
    } catch {
        return res.status(400).json({ error: "Error processing payment" });
    }
};