const db = require('../db');

exports.findById = async (agendaId) => {
    return db('agenda').where({ agenda_id: agendaId }).first();
};

exports.create = async (agendaData) => {
    const [agendaId] = await db('agenda').insert(agendaData).returning('agenda_id');
    return db('agenda').where({ agenda_id: agendaId }).first();
};

exports.update = async (agendaId, agendaData) => {
    return db('agenda')
        .where({ agenda_id: agendaId })
        .update(agendaData);
};

exports.delete = async (agendaId) => {
    return db('agenda')
        .where({ agenda_id: agendaId })
        .del();
};