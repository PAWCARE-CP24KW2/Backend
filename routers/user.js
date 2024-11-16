const express = require('express');
const router = express.Router();
const db = require('../db');

// -------------------- User API --------------------
// Method: GET
// pass Get user/id
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await db('user').where({ user_id: userId }).first();
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: POST
//pass Post user/register
router.post('/register', async (req, res) => {
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
        const [userId] = await db('user').insert({
            username, password, email, user_firstname, user_lastname, user_phone, create_at: new Date()
        });
        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Post user/auth/login
router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db('user').where({ username, password }).first();
        if (user) res.json({ message: 'Login successful', user });
        else res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: PUT
//pass Put user/id
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
        const updated = await db('user').where({ user_id: userId }).update({
            username, password, email, user_firstname, user_lastname, user_phone
        });
        if (updated) res.json({ message: 'User updated successfully' });
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: DELETE
//pass Delete user/id
// router.delete('/:userId', async (req, res) => {
//     const { userId } = req.params;
//     try {
//         // Delete data in the comment table linked to posts
//         await db('comment').whereIn('post_post_id', function() {
//             this.select('post_id').from('post').where('user_user_id', userId);
//         }).del();

//         // Delete data in the category table linked to posts
//         await db('category').whereIn('post_id', function() {
//             this.select('post_id').from('post').where('user_user_id', userId);
//         }).del();
        
//         // Delete data in the post table linked to the user
//         await db('post').where({ user_user_id: userId }).del();
        
//         // Delete data in the user table
//         const deleted = await db('user').where({ user_id: userId }).del();
//         if (deleted) res.json({ message: 'User deleted successfully' });
//         else res.status(404).json({ message: 'User not found' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Delete the user entry from the database
        const deletedRows = await db('user')
            .where({ user_id: userId })
            .del();

        if (deletedRows) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;