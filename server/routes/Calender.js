const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/CalenderController'); // Import function

router.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

module.exports = router;
