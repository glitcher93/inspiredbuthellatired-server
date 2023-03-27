import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

const convertImage = async (req: Request, res: Response, next: NextFunction) => {

    const { file } = req;

    if (!file) {
        return next();
    }

    const { path } = file;

    const newPath = path.replace(/\.jpg|\.jpeg|\.png|\.webp/gi, '.webp');

    try {
        await sharp(path)
            .webp({ quality: 80 })
            .toFile(newPath);

        req.file!.path = newPath;

        next();
    } catch (e) {
        return res.status(500).json({ message: 'Error converting image', error: e });
    }
}

export default convertImage;