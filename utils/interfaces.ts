import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken"

export interface IFile {
    mimetype: string
}

export interface IRequest extends Request {
    payload?: string | JwtPayload
}

export interface IItem {
    id: number 
    price: number 
    title: string 
    size: string 
    image: string 
    type: string
    quantity: number
}
