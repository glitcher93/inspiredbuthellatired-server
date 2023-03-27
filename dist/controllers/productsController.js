"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsAdmin = exports.getPrints = exports.getPaintings = exports.getAllProducts = void 0;
const db_1 = __importDefault(require("../db"));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, db_1.default)('products');
        return res.status(200).json(products);
    }
    catch (_a) {
        res.status(400).json({ error: 'error getting products' });
    }
});
exports.getAllProducts = getAllProducts;
const getPaintings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, db_1.default)('products').where({ type: "Painting" });
        return res.status(200).json(products);
    }
    catch (_b) {
        res.status(400).json({ error: 'error getting products' });
    }
});
exports.getPaintings = getPaintings;
const getPrints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, db_1.default)('products').where({ type: "Print" });
        return res.status(200).json(products);
    }
    catch (_c) {
        res.status(400).json({ error: 'error getting products' });
    }
});
exports.getPrints = getPrints;
const getProductsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, db_1.default)('products');
        return res.status(200).json(products);
    }
    catch (_d) {
        res.status(400).json({ error: 'error getting products' });
    }
});
exports.getProductsAdmin = getProductsAdmin;
