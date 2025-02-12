const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/auth');

router.post('/:petId/uploadProfile', upload.single('file'), auth, imageController.uploadProfilePet);
router.post('/:petId/uploadRegistration', upload.single('file'), auth, imageController.uploadRegistration);
router.post('/:petId/uploadMedicalBook', upload.single('file'), auth, imageController.uploadMedicalBook);
router.post('/:petId/uploadPassportNo', upload.single('file'), auth, imageController.uploadPassportNo);

router.get('/:petId/image/:type', auth, imageController.getImage);


module.exports = router;