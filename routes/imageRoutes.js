const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/auth');

router.post('/:petId/uploadProfile', upload.single('file'), auth, imageController.uploadProfilePet);
// router.post('/:petId/uploadRegistration', upload.single('file'), auth, imageController.uploadRegistration);

module.exports = router;