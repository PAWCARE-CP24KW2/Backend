const Agenda = require('../models/agendaModel');

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
    const { petId } = req.params;
    const { event_title, event_description, event_start, status } = req.body;

    try {
        const newAgenda = await Agenda.create({
            agenda_title: event_title,
            agenda_message: event_description,
            appointment: new Date(event_start),
            status: status || 'Scheduled',
            user_has_pet_pet_pet_id: petId,
            created_at: new Date()
        });

        res.status(201).json({ message: 'Agenda entry created successfully', agenda: newAgenda });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAgenda = async (req, res) => {
    const { agendaId } = req.params;
    const { event_title, event_description, event_start, status } = req.body;

    try {
        const updatedRows = await Agenda.update(agendaId, {
            agenda_title: event_title,
            agenda_message: event_description,
            appointment: new Date(event_start),
            status: status || 'Scheduled',
            created_at: new Date()
        });

        if (updatedRows) {
            res.status(200).json({ message: 'Agenda entry updated successfully' });
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