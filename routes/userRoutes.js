const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId', userController.getUser);
router.post('/register', userController.registerUser);
router.post('/auth/login', userController.loginUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;