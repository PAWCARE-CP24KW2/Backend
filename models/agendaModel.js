const db = require('../db');

exports.findAll = async () => {
    return db('agenda').select('*');
};

exports.findByPetId = async (petId) => {
    return db('agenda').where({ user_has_pet_id: petId }).select('*');
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