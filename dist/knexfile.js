"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Update with your config settings.
const config = {
    development: {
        client: "pg",
        connection: {
            host: "127.0.0.1",
            user: "postgres",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }
    },
    production: {
        client: "pg",
        connection: {
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PW,
            port: Number(process.env.PG_PORT),
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        }
    }
};
exports.default = config;
