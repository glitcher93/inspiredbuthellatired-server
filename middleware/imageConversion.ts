import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

const convertImage = async (req: Request, res: Response, next: NextFunction) => {

    const { file } = req;

    if (!file) {
        return next();
    }

    const { path } = file;

    const newPath = path.replace(/\.jpg|\.jpeg|\.png|\.webp/gi, '.webp');

    await sharp(path)
        .webp({ quality: 80 })
        .toFile(newPath);

    req.file!.path = newPath;

    next();
}

export default convertImage;