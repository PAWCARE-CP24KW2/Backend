const knex = require('knex');

const db = knex.default({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'qian0108',
        port: 3306,
        database: 'mydb'
    }
});

module.exports = db;
