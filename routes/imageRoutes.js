const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/auth');

router.post('/:petId/upload', upload.single('file'), auth, imageController.uploadImage);

module.exports = router;