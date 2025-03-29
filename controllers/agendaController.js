const Agenda = require('../models/agendaModel');

exports.getAllAgendasByUserId = async (req, res) => {
    const { userId } = req.user;
    try {
        const agendas = await Agenda.findAllByUserId(userId);
        res.status(200).json(agendas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllAgendas = async (req, res) => {
    try {
        const agendas = await Agenda.findAll();
        res.status(200).json(agendas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Agenda.findAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

exports.getAgendasByPetId = async (req, res) => {
    const { petId } = req.params;

    try {
        const agendas = await Agenda.findByPetId(petId);
        if (agendas.length > 0) {
            res.status(200).json(agendas);
        } else {
            res.status(404).json({ error: 'No agenda entries found for this pet' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAgenda = async (req, res) => {
    const { agendaId } = req.params;

    try {
        const agenda = await Agenda.findById(agendaId);

        if (agenda) {
            res.status(200).json(agenda);
        } else {
            res.status(404).json({ error: 'Agenda entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAgenda = async (req, res) => {
    const { userId } = req.user;
    const { petId } = req.params;
    const { event_title, event_description, event_start, status, agenda_category_id } = req.body;

    try {
        const newAgenda = await Agenda.create({
            agenda_title: event_title,
            agenda_message: event_description,
            appointment: new Date(event_start),
            status: status || 'Scheduled',
            pet_id: petId,
            user_id: userId,
            agenda_category_id: agenda_category_id,
            created_at: new Date()
        });

        res.status(201).json({ ...newAgenda });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAgenda = async (req, res) => {
    const { agendaId } = req.params;
    const { event_title, event_description, event_start, status } = req.body;

    try {
        const updatedAgenda = await Agenda.update(agendaId, {
            agenda_title: event_title,
            agenda_message: event_description,
            appointment: new Date(event_start),
            status: status || 'Scheduled',
            created_at: new Date()
        });

        if (updatedAgenda) {
            res.status(200).json({ ...updatedAgenda });
        } else {
            res.status(404).json({ error: 'Agenda entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAgenda = async (req, res) => {
    const { agendaId } = req.params;

    try {
        const deletedRows = await Agenda.delete(agendaId);

        if (deletedRows) {
            res.status(200).json({ message: 'Agenda entry deleted successfully' });
        } else {
            res.status(404).json({ error: 'Agenda entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getExpiredAgendasByPetId = async (req, res) => {
    const { petId } = req.params;

    try {
        const expiredAgendas = await Agenda.findExpiredByPetId(petId);
        res.status(200).json(expiredAgendas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};