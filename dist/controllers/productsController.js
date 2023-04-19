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
exports.deleteProduct = exports.editProduct = exports.addProduct = exports.getRandomProducts = exports.getPrints = exports.getPaintings = exports.getAllProducts = void 0;
const db_1 = __importDefault(require("../db"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const serverURL = process.env.SERVER_URL || 'http://localhost:8080';
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
const getRandomProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, db_1.default)('products').orderByRaw('RANDOM()').limit(6);
        return res.status(200).json(products);
    }
    catch (_d) {
        res.status(400).json({ error: 'error getting products' });
    }
});
exports.getRandomProducts = getRandomProducts;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, size, price, type } = req.body;
    console.log(req.file);
    const newProduct = {
        title,
        image: `${serverURL}/images/${req.file.filename.replace(path_1.default.extname(req.file.filename), '.webp')}`,
        size,
        priceInCents: price * 100,
        type
    };
    try {
        const products = yield (0, db_1.default)("products");
        const foundProduct = products.find(product => product.title === title);
        if (!foundProduct) {
            yield (0, db_1.default)("products").insert(newProduct);
            return res.status(201).send("Product created!");
        }
        else {
            return res.status(400).send("Error saving product");
        }
    }
    catch (_e) {
        return res.status(400).send("Error saving product");
    }
});
exports.addProduct = addProduct;
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, size, price, type, inStock } = req.body;
    const { id } = req.params;
    try {
        const product = yield (0, db_1.default)("products").where({ id });
        const foundProduct = product[0];
        if (req.file && foundProduct.image.startsWith(serverURL)) {
            fs_1.default.unlink("public" + foundProduct.image.replace(serverURL, ''), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        let stockBool;
        if (inStock === "true") {
            stockBool = true;
        }
        else {
            stockBool = false;
        }
        const editedProduct = {
            title: title && title !== foundProduct.title ? title : foundProduct.title,
            image: req.file ? `${serverURL}/images/${req.file.filename.replace(path_1.default.extname(req.file.filename), '.webp')}` : foundProduct.image,
            size: size && size !== foundProduct.size ? size : foundProduct.size,
            priceInCents: price && price !== Number(foundProduct.priceInCents) ? Number(price) * 100 : Number(foundProduct.priceInCents),
            type: type && type !== foundProduct.type ? type : foundProduct.type,
            inStock: inStock && stockBool !== foundProduct.inStock ? stockBool : foundProduct.inStock
        };
        console.log(editedProduct);
        yield (0, db_1.default)("products").update(editedProduct).where({ id });
        return res.status(200).send("Product Edited!");
    }
    catch (e) {
        return res.status(404).send("Product not found.");
    }
});
exports.editProduct = editProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield (0, db_1.default)("products").where({ id });
        const foundProduct = product[0];
        const orders = yield (0, db_1.default)('orders');
        const productExistsInOrder = [];
        orders.forEach((order) => {
            if (order.products.includes(foundProduct.id)) {
                productExistsInOrder.push(true);
            }
            else {
                productExistsInOrder.push(false);
            }
        });
        if (productExistsInOrder.some((el) => el === true)) {
            return res.status(400).send("Cannot delete product: The product exists in one or more order. The order(s) must be fulfilled and deleted before you can delete this product.");
        }
        else {
            fs_1.default.unlink("public" + foundProduct.image.replace(serverURL, ''), (err) => {
                if (err) {
                    console.log(err);
                }
            });
            yield (0, db_1.default)('products').delete().where({ id });
            return res.status(200).send("Product successfully deleted.");
        }
    }
    catch (e) {
        return res.status(404).send("Product not found.");
    }
});
exports.deleteProduct = deleteProduct;
