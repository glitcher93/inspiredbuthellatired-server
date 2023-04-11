"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, `${file.originalname.replace(path_1.default.extname(file.originalname), '')}_${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
const fileType = (req, file, filterFile) => {
    if (file.mimetype === 'image/jpeg' || 'image/png' || 'image/webp') {
        filterFile(null, true);
    }
    else {
        filterFile(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter: fileType
}).single('image');
exports.default = upload;
