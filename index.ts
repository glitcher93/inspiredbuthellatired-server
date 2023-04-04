import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import products from './routes/products';
import webhook from './routes/webhook';
import checkout from './routes/checkout';
import orders from './routes/orders';
import admin from './routes/admin';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use('/webhook', express.raw({type: "application/json"}), webhook);
app.use(express.json());
app.use(express.static('public'));

app.use('/products', products);
app.use('/checkout', checkout);
app.use('/orders', orders);
app.use('/admin', admin);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));