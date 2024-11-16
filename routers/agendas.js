const express = require('express');
const router = express.Router();
const db = require('../db');

router.put('/:agendaId', async (req, res) => {
    const { agendaId } = req.params;
    const { event_title, event_description, event_start, status } = req.body;

    try {
        // Update the agenda entry in the database
        const updatedRows = await db('agenda')
            .where({ agenda_id: agendaId })
            .update({
                agenda_title: event_title,
                agenda_message: event_description,
                appointment: new Date(event_start),
                status: status || 'Scheduled', // Provide a default value if not provided
                created_at: new Date() // Update the created_at column
            });

        if (updatedRows) {
            res.status(200).json({ message: 'Agenda entry updated successfully' });
        } else {
            res.status(404).json({ error: 'Agenda entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:agendaId', async (req, res) => {
    const { agendaId } = req.params;

    try {
        // Delete the agenda entry from the database
        const deletedRows = await db('agenda')
            .where({ agenda_id: agendaId })
            .del();

        if (deletedRows) {
            res.status(200).json({ message: 'Agenda entry deleted successfully' });
        } else {
            res.status(404).json({ error: 'Agenda entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;