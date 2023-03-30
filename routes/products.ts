import express from 'express';
import { getAllProducts, getPaintings, getPrints, getRandomProducts } from '../controllers/productsController';

const router = express.Router();

router.get('/', getAllProducts);

router.get('/paintings', getPaintings);

router.get('/prints', getPrints);

router.get('/featured', getRandomProducts)

export default router;