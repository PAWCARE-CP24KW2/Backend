const db = require('../db');

exports.findAllByUserId = async (userId) => {
    return db('agenda').where({ user_id: userId }).select('*');
};

exports.findAll = async () => {
    return db('agenda').select('*');
};

exports.findAllCategories = async () => {
    return db('agenda_category').select('*');
};

exports.findByPetId = async (petId) => {
    return db('agenda').where({ pet_id: petId }).select('*');
};

exports.findById = async (agendaId) => {
    return db('agenda').where({ agenda_id: agendaId }).first();
};

exports.create = async (agendaData) => {
    const [agendaId] = await db('agenda').insert(agendaData).returning('agenda_id');
    return db('agenda').where({ agenda_id: agendaId }).first();
};

exports.update = async (agendaId, agendaData) => {
    await db('agenda')
        .where({ agenda_id: agendaId })
        .update(agendaData);
    return db('agenda').where({ agenda_id: agendaId }).first();
};

exports.delete = async (agendaId) => {
    return db('agenda')
        .where({ agenda_id: agendaId })
        .del();
};

exports.findExpiredByPetId = async (petId) => {
    const currentDate = new Date();
    return db('agenda')
        .where('pet_id', petId)
        .andWhere('appointment', '<', currentDate)
        .select('*');
};