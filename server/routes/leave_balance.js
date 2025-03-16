const express = require('express');
const leaveBalanceController = require('../controllers/leaveBalanceController');
const router = express.Router();

router.get('/', leaveBalanceController.getAllLeaveData);
router.put('/admin/:user_id', leaveBalanceController.updateLeaveData);
router.put('/reduce_leave_balance', leaveBalanceController.reduceLeaveBalance);
router.get('/leave/admin', leaveBalanceController.getLeaveSetAdmin);
router.put('/leave/admin/update', leaveBalanceController.updateLeaveSetAdmin);

module.exports = router;