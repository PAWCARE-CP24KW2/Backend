require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (user) => {
    const payload = {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        user_phone: user.user_phone
    };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '5min' };
    return jwt.sign(payload, secret, options);
};

exports.getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const Users = await User.findAllUser();
        res.status(200).json(Users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registerUser = async (req, res) => {
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = await User.create({
            username, password, email, user_firstname, user_lastname, user_phone, create_at: new Date()
        });
        res.status(201).json({ ...newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', { username, password });
    try {
        const user = await User.findByCredentials(username, password);
        if (user) {
            const token = generateToken(user);
            res.json({ message: 'Login successful', token });
        } else {
            console.log('Invalid username or password');
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user) {
            const token = generateToken(user);
            res.json({ message: 'Token refreshed', token });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser && existingUser.user_id !== parseInt(userId)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const updatedUser = await User.update(userId, {
            username, password, email, user_firstname, user_lastname, user_phone
        });
        if (updatedUser) res.json({ ...updatedUser });
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const deletedRows = await User.delete(userId);
        if (deletedRows) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  