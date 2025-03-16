const express = require('express');
const permissionController = require('../controllers/permissionController');
const router = express.Router();

router.post('/', permissionController.addPermission);
router.get('/', permissionController.getAllPermissions);
router.put('/update/:id', permissionController.updatePermissionStatus);

module.exports = router;