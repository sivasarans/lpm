const express = require('express');
const leaveDataController = require('../controllers/AllinOneController/x');
const router = express.Router();

// Get all leave data
router.get('/leave-data', leaveDataController.getAllLeaveData);

// Update leave data
router.put('/leave-data/:user_id', leaveDataController.updateLeaveData);

// Apply for leave
router.post('/apply-leave', leaveDataController.applyLeave);

// Reduce leave balance
router.put('/reduce-leave-balance', leaveDataController.reduceLeaveBalance);

// Get all leave applications
router.get('/leave-applications', leaveDataController.getAllLeaveApplications);

// Update leave status
router.put('/leave-status/:id', leaveDataController.updateLeaveStatus);

// Delete leave application
router.delete('/leave-application/:id', leaveDataController.deleteLeaveApplication);

module.exports = router;
