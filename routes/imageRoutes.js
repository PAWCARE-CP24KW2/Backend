const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/auth');

router.get('/:petId/getFilePath/:fileType', auth, imageController.getFilePath);
router.post('/:petId/uploadProfile', upload.single('file'), auth, imageController.uploadProfilePet);
router.post('/:petId/uploadRegistration', upload.single('file'), auth, imageController.uploadRegistration);
router.post('/:petId/uploadMedicalBook', upload.single('file'), auth, imageController.uploadMedicalBook);
router.post('/:petId/uploadPassportNo', upload.single('file'), auth, imageController.uploadPassportNo);
router.delete('/:petId/deleteProfile', auth, imageController.deleteProfilePet);
router.delete('/:petId/deleteDocument/:fileType', auth, imageController.deleteDocument);

module.exports = router;