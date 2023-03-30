import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken"

export interface IFile {
    mimetype: string
}

export interface IRequest extends Request {
    payload?: string | JwtPayload
}

export interface IItem {
    id: string 
    priceInCents: number 
    title: string 
    size: string 
    image: string 
    type: string
    quantity: number
    inStock?: boolean
}

export interface IItemHash {
    [key: string]: IItem
}
