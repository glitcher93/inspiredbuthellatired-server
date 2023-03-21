"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrints = exports.getPaintings = exports.getAllProducts = void 0;
const db_1 = __importDefault(require("../db"));
const getAllProducts = (req, res) => {
    (0, db_1.default)('products')
        .then(products => {
        res.status(200).json(products);
    })
        .catch(err => {
        res.status(400).json({ error: 'error getting products' });
    });
};
exports.getAllProducts = getAllProducts;
const getPaintings = (req, res) => {
    (0, db_1.default)('products')
        .where({ type: "Painting" })
        .then(products => {
        res.status(200).json(products);
    })
        .catch(err => {
        res.status(400).json({ error: 'error getting products' });
    });
};
exports.getPaintings = getPaintings;
const getPrints = (req, res) => {
    (0, db_1.default)('products')
        .where({ type: "Print" })
        .then(products => {
        res.status(200).json(products);
    })
        .catch(err => {
        res.status(400).json({ error: 'error getting products' });
    });
};
exports.getPrints = getPrints;
