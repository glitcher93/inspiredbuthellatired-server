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
exports.login = void 0;
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const users = yield (0, db_1.default)('admin');
        const foundUser = users.find(user => user.email === email);
        const passwordMatches = bcrypt_1.default.compareSync(password, foundUser.password);
        if (!foundUser) {
            res.status(404).send("User not found");
        }
        if (foundUser && !passwordMatches) {
            res.status(401).send("Incorrect password, try again.");
        }
        if (foundUser && passwordMatches) {
            const payload = {
                id: foundUser.id,
                email: foundUser.email
            };
            const token = jsonwebtoken_1.default.sign(payload, secret);
            res.status(200).json({
                token
            });
        }
    }
    catch (_a) {
        res.status(401).json({
            message: "Invalid email or password"
        });
    }
});
exports.login = login;
