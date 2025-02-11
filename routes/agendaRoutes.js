const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const auth = require('../middleware/auth');

router.get('/', agendaController.getAllAgendas);
router.get('/categories', agendaController.getAllCategories);

router.get('/myAgendas', auth, agendaController.getAllAgendasByUserId);
router.get('/pet/:petId', auth,  agendaController.getAgendasByPetId);
router.get('/:agendaId', auth, agendaController.getAgenda);
router.post('/:petId/agendas', auth, agendaController.createAgenda);
router.put('/:agendaId', auth, agendaController.updateAgenda);
router.delete('/:agendaId', auth, agendaController.deleteAgenda);

module.exports = router;