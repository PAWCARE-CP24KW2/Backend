const db = require('../db');

exports.uploadDocument = async (documentData) => {
    return db('documents').insert({ ...documentData, created_at: new Date() });
};