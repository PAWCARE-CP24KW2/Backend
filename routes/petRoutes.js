const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const auth = require('../middleware/auth');

router.get('/pets', petController.getAllPets);

router.get('/myPet', auth, petController.getMyPets);
router.get('/:petId', auth, petController.getPetById);
router.get('/:petId/users', auth, petController.getUsersByPetId);
router.get('/:petId/expiredAgendas', auth, petController.getExpiredAgendasByPetId); // Update this line

router.post('/addPet', auth, upload.single('profile_picture'), petController.addPet );

router.put('/:petId', auth, petController.updatePet);

router.delete('/:petId', auth, petController.deletePet);

module.exports = router;