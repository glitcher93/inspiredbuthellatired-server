"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const convertImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return next();
    }
    try {
        yield (0, sharp_1.default)(req.file.path)
            .webp()
            .toFile(`./public/images/${req.file.filename.replace(path_1.default.extname(req.file.originalname), '.webp')}`);
        fs_1.default.unlink("public/images/" + req.file.filename, (err) => {
            if (err) {
                console.log(err);
            }
        });
        return next();
    }
    catch (e) {
        return res.status(500).json({ message: 'Error converting image', error: e.message });
    }
});
exports.default = convertImage;
