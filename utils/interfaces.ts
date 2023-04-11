import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken"

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

export interface IOrder {
    id: string
    orderId: string
    customerId: string
    paymentIntentId: string
    products: string[]
    quantities: number[]
    subtotal: number
    total: number
    name: string
    addressLineOne: string
    addressLineTwo?: string
    city: string
    state: string
    postalCode: string
    phoneNumber: string
    trackingNumber?: string
    isFulfilled: boolean
    createdAt: string
    updatedAt: string
}
