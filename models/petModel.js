const db = require('../db');

exports.findAll = async () => {
    return db('pet').select('*');
};

exports.findById = async (petId) => {
    return db('pet').where({ pet_id: petId }).first();
};

exports.create = async (petData) => {
    const [petId] = await db('pet').insert({ ...petData, created_at: new Date() }).returning('pet_id');
    return db('pet').where({ pet_id: petId }).first();
};

exports.findByUserId = async (userId) => {
    return db('pet').where({ user_id: userId });
};

exports.findUsersByPetId = async (petId) => {
    return db('user')
        .join('pet', 'user.user_id', '=', 'pet.user_id')
        .where({ pet_id: petId });
};

// exports.uploadDocument = async (documentData) => {
//     return db('documents').insert({ ...documentData, created_at: new Date() });
// };

exports.update = async (petId, petData) => {
    await db('pet').where({ pet_id: petId }).update(petData);
    return db('pet').where({ pet_id: petId }).first();
};

exports.delete = async (petId) => {
    return db('pet').where({ pet_id: petId }).del();
};