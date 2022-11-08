require('dotenv').config({ path: process.env.OLDPWD + '/.env' })
    // DEV
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DBNAME,
        port: process.env.MYSQL_PORT
    },
    // debug: true
});

// const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'activities',
//         port: '3306'
//     },
//     // debug: true
// });

module.exports = knex