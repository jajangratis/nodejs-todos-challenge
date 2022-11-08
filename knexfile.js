// Update with your config settings.
require('dotenv').config({ path: process.env.OLDPWD + '/.env' })
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: process.env.MYSQL_DBNAME,
      user:     process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  staging: {
    client: 'mysql',
    connection: {
      database: process.env.MYSQL_DBNAME,
      user:     process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: process.env.MYSQL_DBNAME,
      user:     process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
