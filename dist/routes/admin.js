"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
// import { getAllOrders } from '../controllers/ordersController';
// import { getAllProducts } from '../controllers/productsController';
// import auth from '../middleware/auth';
const router = express_1.default.Router();
router.post('/login', adminController_1.login);
// router.get('/orders', auth, getAllOrders)
// router.delete('/delete-order/:id', auth)
// router.get('/products', auth, getAllProducts)
// router.post('/new-product', auth)
// router.put('/edit-product/:id', auth)
// router.delete('/delete-product/:id', auth)
exports.default = router;
