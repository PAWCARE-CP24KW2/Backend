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

exports.update = async (petId, petData) => {
    await db('pet').where({ pet_id: petId }).update(petData);
    return db('pet').where({ pet_id: petId }).first();
};

exports.delete = async (petId) => {
    return db('pet').where({ pet_id: petId }).del();
};

exports.deleteDocumentsByPetId = async (petId) => {
    return db('documents').where({ pet_id: petId }).del();
};

exports.deleteAgendaByPetId = async (petId) => {
    return db('agenda').where({ pet_id: petId }).del();
};

exports.deleteGalleryByPetId = async (petId) => {
    return db('gallery').where({ pet_id: petId }).del();
};

exports.findPhoneById = async (userId) => {
    return db('user')
        .select('user_phone')
        .where({ user_id: userId })
        .first();
};

exports.updateQRCodePath = async (petId, qrCodeBase64) => {
    return db('pet').where({ pet_id: petId }).update({ qr_code_base64: qrCodeBase64 });
};
