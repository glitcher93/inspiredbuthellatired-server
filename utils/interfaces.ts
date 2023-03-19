import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken"

export interface IFile {
    mimetype: string
}

export interface IRequest extends Request {
    payload?: string | JwtPayload
}
