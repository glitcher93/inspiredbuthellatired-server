import express from 'express';
import { checkout } from '../controllers/checkoutController';

const router = express.Router();

router.post('/', checkout);

export default router;