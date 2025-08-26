/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('categories', table => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description');
    table.string('color', 7); // hex color code
    table.string('icon', 50); // icon name or class
    table.integer('user_id').unsigned();
    table.boolean('is_default').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.unique(['name', 'user_id']);
    table.index('user_id');
    table.index('is_default');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('categories');
};
