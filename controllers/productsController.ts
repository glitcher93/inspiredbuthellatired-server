import db from '../db';
import { Request, Response } from "express";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const serverURL = process.env.SERVER_URL || 'http://localhost:8080';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await db('products');
        return res.status(200).json(products);
    } catch {
        res.status(400).json({error: 'error getting products'})
    }
}

export const getPaintings = async (req: Request, res: Response) => {
    try {
        const products = await db('products').where({type: "Painting"});
        return res.status(200).json(products);
    } catch {
        res.status(400).json({error: 'error getting products'})
    }
}

export const getPrints = async (req: Request, res: Response) => {
    try {
        const products = await db('products').where({type: "Print"});
        return res.status(200).json(products);
    } catch {
        res.status(400).json({error: 'error getting products'})
    }
}

export const getRandomProducts = async (req: Request, res: Response) => {
    try {
        const products = await db('products').orderByRaw('RANDOM()').limit(6);
        return res.status(200).json(products);
    } catch {
        res.status(400).json({error: 'error getting products'})
    }
}

export const addProduct = async (req: Request, res: Response) => {
    const { title, size, price, type } = req.body;

    console.log(req.file)

    const newProduct = {
        title,
        image: `${serverURL}/images/${req.file!.filename.replace(path.extname(req.file!.filename), '.webp')}`,
        size,
        priceInCents: price * 100,
        type
    }

    try {
        const products = await db("products");

        const foundProduct = products.find(product => product.title === title);

        if (!foundProduct) {
            await db("products").insert(newProduct);
            return res.status(201).send("Product created!")
        } else {
            return res.status(400).send("Error saving product");
        }
    } catch {
        return res.status(400).send("Error saving product");
    }
}

export const editProduct = async (req: Request, res: Response) => {
    const { title, size, price, type, inStock } = req.body;
    const { id } = req.params;

    try {
        const product = await db("products").where({id})

        const foundProduct = product[0];

        if (req.file! && foundProduct.image.startsWith(serverURL)) {
            fs.unlink("public" + foundProduct.image.replace(serverURL, ''), (err) => {
                if (err) {
                    console.log(err)
                }
            });
        }

        const editedProduct = {
            title: title && title !== foundProduct.title ? title : foundProduct.title,
            image: req.file! ? `${serverURL}/images/${req.file.filename.replace(path.extname(req.file.filename), '.webp')}` : foundProduct.image,
            size: size && size !== foundProduct.size ? size : foundProduct.size,
            priceInCents: price && price !== Number(foundProduct.priceInCents) ? Number(price) * 100 : Number(foundProduct.priceInCents),
            type: type && type !== foundProduct.type ? type : foundProduct.type,
            inStock: inStock && inStock !== foundProduct.inStock ? inStock : foundProduct.inStock
        }

        console.log(editedProduct)

        await db("products").update(editedProduct).where({id});
        return res.status(200).send("Product Edited!")
    } catch (e: any) {
        return res.status(404).send("Product not found.")
    }
    
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await db("products").where({id})

        const foundProduct = product[0];

        const orders = await db('orders');

        const productExistsInOrder: boolean[] = [];

        orders.forEach((order) => {
            if (order.products.includes(foundProduct.id)) {
                productExistsInOrder.push(true)
            } else {
                productExistsInOrder.push(false)
            }
        })

        if (productExistsInOrder.some((el) => el === true)) {
            return res.status(400).send("Cannot delete product: The product exists in one or more order. The order(s) must be fulfilled and deleted before you can delete this product.")
        } else {
            fs.unlink("public" + foundProduct.image.replace(serverURL, ''), (err) => {
                if (err) {
                    console.log(err)
                }
            });
            await db('products').delete().where({id})
            return res.status(200).send("Product successfully deleted.")
        }

    } catch (e: any) {
        return res.status(404).send("Product not found.")
    }
}

