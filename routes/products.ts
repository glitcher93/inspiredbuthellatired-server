import express from 'express';
import { getAllProducts, getPaintings, getPrints } from '../controllers/productsController';

const router = express.Router();

router.get('/', getAllProducts);

router.get('/paintings', getPaintings);

router.get('/prints', getPrints);

export default router;