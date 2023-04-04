import express from 'express';
import { login } from '../controllers/adminController';
// import { getAllOrders } from '../controllers/ordersController';
// import { getAllProducts } from '../controllers/productsController';
// import auth from '../middleware/auth';

const router = express.Router();

router.post('/login', login);

// router.get('/orders', auth, getAllOrders)

// router.delete('/delete-order/:id', auth)

// router.get('/products', auth, getAllProducts)

// router.post('/new-product', auth)

// router.put('/edit-product/:id', auth)

// router.delete('/delete-product/:id', auth)

export default router;

