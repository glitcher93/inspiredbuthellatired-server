import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('products', (table) => {
            table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("GEN_RANDOM_UUID()"));
            table
                .string("title")
                .notNullable();
            table
                .string("image")
                .notNullable()
            table
                .string("size")
                .notNullable();
            table
                .integer("priceInCents")
                .notNullable();
            table
                .string("type")
                .notNullable();
            table
                .boolean("inStock")
                .defaultTo(true)
                .notNullable();
        })
        .createTable('orders', (table) => {
            table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("GEN_RANDOM_UUID()"));
            table
                .specificType("products", "UUID[]")
                .notNullable();
            table
                .specificType("quantities", "INTEGER[]")
                .unsigned()
                .notNullable();
            table
                .string("orderNumber")
                .notNullable();
            table
                .integer("orderCreatedAt")
                .notNullable();
            table
                .boolean("isFulfilled")
                .defaultTo(false)
                .notNullable();
            table
                .string("trackingNumber");

        })
        .createTable('admin', (table) => {
            table
                .uuid("id")
                .primary()
                .defaultTo(knex.raw("GEN_RANDOM_UUID()"));
            table
                .string("email")
                .notNullable();
            table
                .string("password")
                .notNullable();
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('products')
        .dropTableIfExists('orders')
        .dropTableIfExists('admin');
}

