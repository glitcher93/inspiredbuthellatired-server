"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
const webhook_1 = __importDefault(require("./routes/webhook"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use('/webhook', express_1.default.raw({ type: "*/*" }), webhook_1.default);
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use('/products', products_1.default);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
