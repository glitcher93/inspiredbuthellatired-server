import db from '../db';
import { Request, Response } from "express";

export const getAllProducts = (req: Request, res: Response) => {
    db('products')
        .then(products => {
            res.status(200).json(products)
        })
        .catch(err => {
            res.status(400).json({error: 'error getting products'})
        })
}

export const getPaintings = (req: Request, res: Response) => {
    db('products')
        .where({type: "Painting"})
        .then(products => {
            res.status(200).json(products);
        })
        .catch(err => {
            res.status(400).json({error: 'error getting products'})
        })
}

export const getPrints = (req: Request, res: Response) => {
    db('products')
        .where({type: "Print"})
        .then(products => {
            res.status(200).json(products);
        })
        .catch(err => {
            res.status(400).json({error: 'error getting products'})
        })
}

