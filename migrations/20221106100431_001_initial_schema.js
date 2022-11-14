//const db = require('./config/database');

exports.up = async (knex)=> {

    await knex.raw(` 
    CREATE TABLE IF NOT EXISTS activities ( id int unsigned NOT NULL AUTO_INCREMENT,
        activity_group_id int DEFAULT NULL,
        email varchar(100) DEFAULT NULL,
        title varchar(50) DEFAULT NULL,
        created_at datetime DEFAULT NULL,
        updated_at datetime DEFAULT NULL,
        deleted_at datetime DEFAULT NULL,
        PRIMARY KEY (id),
        KEY id (id) )
    `);

    await knex.raw(` 
        CREATE TABLE IF NOT EXISTS todos ( id int unsigned NOT NULL AUTO_INCREMENT,
            activity_group_id int DEFAULT NULL,
            is_active BOOL DEFAULT TRUE NULL,
            priority varchar(20) DEFAULT 'very-high',
            title varchar(50) DEFAULT NULL,
            created_at datetime DEFAULT NULL,
            updated_at datetime DEFAULT NULL,
            deleted_at datetime DEFAULT NULL,
            PRIMARY KEY (id),
            KEY id (id) )
    `);

    await knex.raw(` 
        CREATE INDEX idx_activities
        ON activities (id, activity_group_id)
    `);

    await knex.raw(` 
        CREATE INDEX idx_todos
        ON todos (id,activity_group_id)
    `);
};

exports.down = function(knex) {
  
};
