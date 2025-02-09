const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const auth = require('../middleware/auth');

router.get('/pets', petController.getAllPets);

router.get('/myPet', auth, petController.getMyPets);
router.get('/:petId', auth, petController.getPetById); // อาจจะไม่ต้องมีเพราะบรรทัดที่ 11 ก็ดึงมาให้แล้ว
router.get('/:petId/users', auth, petController.getUsersByPetId); // อาจจะไม่ต้องมีเหมือนกันนะ แค่คิดๆไว้เฉยๆ
// router.get('/:petId/records', petController.getRecordsByPetId);

router.post('/addPet', auth, petController.addPet);
// router.post('/:petId/documents', upload.single('document'), petController.uploadDocument);

router.put('/:petId', auth, petController.updatePet);

router.delete('/:petId', auth, petController.deletePet);

module.exports = router;