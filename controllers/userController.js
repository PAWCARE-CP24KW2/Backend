const User = require('../models/userModel');

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
    try {
        const user = await User.findByCredentials(username, password);
        if (user) res.json({ message: 'Login successful', user });
        else res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
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