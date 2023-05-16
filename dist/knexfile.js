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
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            connectionString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?options=project%3D${process.env.ENDPOINT_ID}`,
            ssl: { rejectUnauthorized: false }
        }
    }
};
exports.default = config;
