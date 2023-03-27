import db from '../db';
import { Request, Response } from "express";

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

export const getProductsAdmin = async (req: Request, res: Response) => {
    try {
        const products = await db('products');
        return res.status(200).json(products);
    } catch {
        res.status(400).json({error: 'error getting products'})
    }
}

