const express = require('express');
const { img } = require('vamtec');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/', img(['uploads/users_profile', 'timestamp', 'profile_picture']), userController.createUser);
router.get('/', userController.getAllUsers);
router.put('/:user_id', img(['uploads/users_profile', 'timestamp', 'profile_picture']), userController.updateUser);
router.delete('/:user_id', userController.deleteUser);

module.exports = router;