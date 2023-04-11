import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, `${file.originalname.replace(path.extname(file.originalname), '')}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileType = (req: Request, file: Express.Multer.File, filterFile: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || 'image/png' || 'image/webp') {
        filterFile(null, true)
    } else {
        filterFile(null, false)
    }
}

const upload = multer({
    storage,
    fileFilter: fileType
}).single('image')

export default upload;

