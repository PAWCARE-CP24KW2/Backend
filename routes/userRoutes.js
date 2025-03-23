const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/:userId', userController.getUser);
router.post('/register', upload.single('profile_user'), userController.registerUser);
router.put('/update-photo', auth, upload.single('profile_user'), userController.updateUserPhoto);
router.delete('/delete-photo', auth, userController.deleteUserPhoto);
router.post('/auth/login', userController.loginUser);
router.put('/update', auth, userController.updateUser);
router.delete('/delete', auth, userController.deleteUser);

module.exports = router;