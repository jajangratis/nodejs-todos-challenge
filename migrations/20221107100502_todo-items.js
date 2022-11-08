/**
 * @param { require('../config/database') } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('todo-items', function(t) {
        t.increments('id').unsigned().primary();
        t.dateTime('created_at').notNull();
        t.dateTime('updated_at').nullable();
        t.dateTime('deleted_at').nullable();

        t.string('activity_group_id').nullable();
        t.string('title').nullable();
        t.string('is_active').nullable();
    });
};

/**
 * @param { require('../config/database') } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('todo-items');
};
