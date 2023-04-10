import express from 'express';
import { getOrderById } from '../controllers/ordersController';
import validOrder from '../middleware/validOrder';

const router = express.Router();

router.get('/:orderId', validOrder, getOrderById);


export default router;