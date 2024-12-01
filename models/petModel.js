const db = require('../db');

exports.findAll = async () => {
    return db('pet').select('*');
};

exports.findByUserId = async (userId) => {
    return db('user_has_pet')
        .join('pet', 'user_has_pet.pet_id', '=', 'pet.pet_id')
        .where({ user_id: userId });
};

exports.findById = async (petId) => {
    return db('pet').where({ pet_id: petId }).first();
};

exports.findUsersByPetId = async (petId) => {
    return db('user_has_pet')
        .join('user', 'user_has_pet.user_id', '=', 'user.user_id')
        .where({ pet_id: petId });
};

exports.findRecordsByPetId = async (petId) => {
    return db('agenda').where({ user_has_pet_id: petId });
};

exports.create = async (petData) => {
    const [petId] = await db('pet').insert({ ...petData, created_at: new Date() }).returning('pet_id');
    return db('pet').where({ pet_id: petId }).first();
};

exports.export = async (exportData) => {
    return db('exports').insert({ ...exportData, created_at: new Date() });
};

exports.findExportByGencode = async (gencode) => {
    return db('exports').where({ gencode }).first();
};

exports.import = async (importData) => {
    return db('user_has_pet').insert({ ...importData, created_at: new Date() });
};

// exports.addCalendar = async (calendarData) => {
//     return db('calendar').insert({ ...calendarData, created_at: new Date() });
// };

// exports.uploadDocument = async (documentData) => {
//     return db('documents').insert({ ...documentData, created_at: new Date() });
// };

exports.update = async (petId, petData) => {
    await db('pet').where({ pet_id: petId }).update(petData);
    return db('pet').where({ pet_id: petId }).first();
};

exports.deleteUserHasPetByPetId = async (petId) => {
    return db('user_has_pet').where({ pet_id: petId }).del();
};

exports.deleteExportsByPetId = async (petId) => {
    return db('exports').where({ pet_id: petId }).del();
};

exports.deleteAgendaByPetId = async (petId) => {
    return db('agenda').where({ user_has_pet_id: petId }).del();
};

exports.deleteUserHasPet = async (userId, petId) => {
    return db('user_has_pet').where({ user_id: userId, pet_id: petId }).del();
};

exports.delete = async (petId) => {
    return db('pet').where({ pet_id: petId }).del();
};