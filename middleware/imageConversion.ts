import { NextFunction, Request, Response } from "express";
import path from "path";
import sharp from "sharp";
import fs from 'fs';

const convertImage = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.file) {
        return next();
    }

    try {
        await sharp(req.file!.path)
                    .webp()
                    .toFile(`./public/images/${req.file!.filename.replace(path.extname(req.file!.originalname), '.webp')}`)
                    
        fs.unlink("public/images/" + req.file!.filename, (err) => {
            if (err) {
                console.log(err)
            }
        });

        return next();
    } catch (e: any) {
        return res.status(500).json({ message: 'Error converting image', error: e.message });
    }
}

export default convertImage;