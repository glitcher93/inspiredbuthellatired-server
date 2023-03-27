import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import products from './routes/products';
import webhook from './routes/webhook';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use('/webhook', express.raw({type: "*/*"}), webhook);
app.use(express.json());
app.use(express.static('public'));

app.use('/products', products);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));