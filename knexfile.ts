import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
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

export default config;
