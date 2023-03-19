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
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
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
                .notNullable();
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
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTableIfExists('products')
            .dropTableIfExists('orders')
            .dropTableIfExists('admin');
    });
}
exports.down = down;
