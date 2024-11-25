const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/:userId', userController.getUser);
router.post('/register', userController.registerUser);
router.post('/auth/login', userController.loginUser);
router.put('/:userId', auth, userController.updateUser);
router.delete('/:userId', auth, userController.deleteUser);

module.exports = router;