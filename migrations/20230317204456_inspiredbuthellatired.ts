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
                .string("orderId")
                .notNullable();
            table
                .string("customerId")
                .notNullable();
            table
                .string("paymentIntentId")
                .notNullable();           
            table
                .specificType("products", "UUID[]")
                .notNullable();
            table
                .specificType("quantities", "INTEGER[]")
                .unsigned()
                .notNullable();
            table
                .integer("subtotal")
                .unsigned()
                .notNullable();
            table
                .integer("total")
                .unsigned()
                .notNullable();
            table
                .string("name")
            table
                .string("addressLineOne")
                .notNullable()
            table
                .string("addressLineTwo")
            table
                .string("city")
                .notNullable()
            table
                .string("state")
                .notNullable()
            table
                .string("phoneNumber")
                .notNullable()
            table
                .string("paymentStatus")
                .notNullable()
            table
                .boolean("isFulfilled")
                .defaultTo(false)
                .notNullable();
            table
                .string("trackingNumber");
            table
                .timestamps(true, true, true);
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

