import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { IFile } from "../utils/interfaces";

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileType = (req: Request, file: IFile, filterFile: FileFilterCallback) => {
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

