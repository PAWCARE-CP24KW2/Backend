const db = require('../db');

exports.findById = async (userId) => {
    return db('user').where({ user_id: userId }).first();
};

exports.create = async (userData) => {
    const [userId] = await db('user').insert(userData).returning('user_id');
    return userId;
};

exports.findByCredentials = async (username, password) => {
    return db('user').where({ username, password }).first();
};

exports.update = async (userId, userData) => {
    return db('user').where({ user_id: userId }).update(userData);
};

exports.delete = async (userId) => {
    return db('user').where({ user_id: userId }).del();
};