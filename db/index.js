require('dotenv').config();
const knex = require('knex');

const db = knex.default({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    }
});

module.exports = db;
