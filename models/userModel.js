const bcrypt = require('bcryptjs');
const db = require('../db');

exports.findById = async (userId) => {
    return db('user').where({ user_id: userId }).first();
};

exports.create = async (userData) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const [userId] = await db('user').insert(userData).returning('user_id');
    return db('user').where({ user_id: userId }).first();
};

exports.findByUsername = async (username) => {
    return db('user').where({ username }).first();
};

exports.findByCredentials = async (username, password) => {
    const user = await db('user').where({ username }).first();
    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    }
    return null;
};

exports.update = async (userId, userData) => {
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    await db('user').where({ user_id: userId }).update(userData);
    return db('user').where({ user_id: userId }).first();
};

exports.delete = async (userId) => {
    return db('user').where({ user_id: userId }).del();
};

exports.deleteUserWithDependencies = async (userId) => {
    const posts = await db('post').where({ user_id: userId });
    for (const post of posts) {
        await db('comment').where({ post_id: post.post_id }).del();
    }
    await db('post').where({ user_id: userId }).del();
    const pets = await db('pet').where({ user_id: userId });
    for (const pet of pets) {
        await db('expense').where({ pet_id: pet.pet_id }).del();
    }
    await db('pet').where({ user_id: userId }).del();
    return db('user').where({ user_id: userId }).del();
};