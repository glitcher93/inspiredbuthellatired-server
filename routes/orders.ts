import express from 'express';
import { getAllOrders, getOrderById } from '../controllers/ordersController';
import auth from '../middleware/auth';
import validOrder from '../middleware/validOrder';

const router = express.Router();

router.get('/', auth, getAllOrders);

router.get('/:orderId', validOrder, getOrderById);

router.patch('/:id', auth);

export default router;