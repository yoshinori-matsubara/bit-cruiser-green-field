/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary();
    table.string("item_name", 32);
    table.decimal("item_stock", 4, 2);
    table.decimal("consumption_day", 4, 2);
    table.decimal("notification_stock", 4, 2);
    table.date("registration_day");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("items");
};
