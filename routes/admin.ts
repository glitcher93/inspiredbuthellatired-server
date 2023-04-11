import express from 'express';
import { login } from '../controllers/adminController';
import { addTracking, deleteOrder, getAllOrders, getRecentOrders } from '../controllers/ordersController';
import auth from '../middleware/auth';
import { addProduct, deleteProduct, editProduct, getAllProducts } from '../controllers/productsController';
import upload from '../middleware/multer';
import convertImage from '../middleware/imageConversion';

const router = express.Router();

router.post('/login', login);

router.get('/recent-orders', auth, getRecentOrders);

router.get('/orders', auth, getAllOrders);

router.patch('/orders/add-tracking/:id', auth, addTracking);

router.delete('/orders/delete-order/:id', auth, deleteOrder);

router.get('/products', auth, getAllProducts);

router.post('/products/add-product', auth, upload, convertImage, addProduct);

router.patch('/products/edit-product/:id', auth, upload, convertImage, editProduct);

router.delete('/products/delete-product/:id', auth, deleteProduct);

export default router;

