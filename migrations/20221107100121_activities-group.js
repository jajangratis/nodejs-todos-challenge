/**
 * @param { require('../config/database') } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('activities', function(t) {
        t.increments('id').unsigned().primary();
        t.dateTime('created_at').notNull();
        t.dateTime('updated_at').nullable();
        t.dateTime('deleted_at').nullable();

        t.string('email').nullable();
        t.string('title').nullable();
        t.string('priority').nullable();
    });
};

/**
 * @param { require('../config/database') } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('activities');
};
