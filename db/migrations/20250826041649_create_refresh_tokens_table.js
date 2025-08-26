/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', table => {
    table.increments('id').primary();
    table.text('token').unique().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('is_revoked').defaultTo(false);
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('token');
    table.index('user_id');
    table.index('expires_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
