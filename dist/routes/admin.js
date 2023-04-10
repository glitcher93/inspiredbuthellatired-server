"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const ordersController_1 = require("../controllers/ordersController");
// import { getAllProducts } from '../controllers/productsController';
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/login', adminController_1.login);
router.get('/recent-orders', auth_1.default, ordersController_1.getRecentOrders);
router.get('/orders', auth_1.default, ordersController_1.getAllOrders);
router.patch('/add-tracking/:id', auth_1.default, ordersController_1.addTracking);
router.delete('/delete-order/:id', auth_1.default, ordersController_1.deleteOrder);
// router.get('/products', auth, getAllProducts)
// router.post('/new-product', auth)
// router.put('/edit-product/:id', auth)
// router.delete('/delete-product/:id', auth)
exports.default = router;
