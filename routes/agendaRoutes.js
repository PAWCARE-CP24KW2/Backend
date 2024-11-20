const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/', agendaController.getAllAgendas);
router.get('/pet/:petId', agendaController.getAgendasByPetId);
router.get('/:agendaId', agendaController.getAgenda);
router.post('/:petId/agendas', agendaController.createAgenda);
router.put('/:agendaId', agendaController.updateAgenda);
router.delete('/:agendaId', agendaController.deleteAgenda);

module.exports = router;