require('dotenv').config();
const knex = require('knex');
const express = require('express');
const cors = require('cors');

const app = express();

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

// Use the CORS middleware with specific origin
app.use(cors({
    origin: 'http://capstone24.sit.kmutt.ac.th:8080'
}));

// Your other middleware and routes here

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = db;