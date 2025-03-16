const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();

router.get('/users', attendanceController.getAllUsers);
router.post('/bulk-update', attendanceController.bulkUpdateAttendance);
router.all('/', attendanceController.getAttendanceByDate);

module.exports = router;