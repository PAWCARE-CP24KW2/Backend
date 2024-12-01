const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', petController.getAllPets);

router.get('/my', petController.getMyPets);
router.get('/:petId', petController.getPetById);
router.get('/:petId/users', petController.getUsersByPetId);
router.get('/:petId/records', petController.getRecordsByPetId);

router.post('/addPet', petController.addPet);
router.post('/:petId/exports', petController.exportPet);
router.post('/import', petController.importPet);
// router.post('/:petId/calendars', petController.addCalendar);
// router.post('/:petId/documents', upload.single('document'), petController.uploadDocument);

router.put('/:petId', petController.updatePet);

router.delete('/:petId', petController.deletePet);

module.exports = router;