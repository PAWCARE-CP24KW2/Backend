const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (user) => {
    return jwt.sign({ userId: user.user_id, userName: user.username, email: user.email, firstName: user.user_firstname, lastName: user.user_lastname, phone: user.user_phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshtoken = (user) => {
    return jwt.sign({ userId: user.user_id, userName: user.username, email: user.email, firstName: user.user_firstname, lastName: user.user_lastname, phone: user.user_phone }, process.env.JWT_REFRESH_SECRET, { expiresIn: '5h' });
}

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

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
            const token = generateToken(user);
            res.json({ token });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByCredentials(username, password);
        if (user) {
            const token = generateToken(user);
            const refreshToken = generateRefreshtoken(user);
            res.json({ message: 'Login successful', user, token, refreshToken });
        } else res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.user;
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
    const { userId } = req.user;
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