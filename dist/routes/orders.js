"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ordersController_1 = require("../controllers/ordersController");
const validOrder_1 = __importDefault(require("../middleware/validOrder"));
const router = express_1.default.Router();
router.get('/:orderId', validOrder_1.default, ordersController_1.getOrderById);
exports.default = router;
