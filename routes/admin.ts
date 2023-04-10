import express from 'express';
import { login } from '../controllers/adminController';
import { addTracking, deleteOrder, getAllOrders, getOrderById, getRecentOrders } from '../controllers/ordersController';
// import { getAllProducts } from '../controllers/productsController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/login', login);

router.get('/recent-orders', auth, getRecentOrders);

router.get('/orders', auth, getAllOrders);

router.patch('/add-tracking/:id', auth, addTracking)

router.delete('/delete-order/:id', auth, deleteOrder)

// router.get('/products', auth, getAllProducts)

// router.post('/new-product', auth)

// router.put('/edit-product/:id', auth)

// router.delete('/delete-product/:id', auth)

export default router;

