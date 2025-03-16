const express = require('express');
const { img } = require('vamtec');
const leaveDataController = require('../controllers/leaveDataController');
const router = express.Router();

router.get('/', leaveDataController.getAllLeaveData);
router.put('/admin/:user_id', leaveDataController.updateLeaveData);
router.post('/apply_leave', img(['uploads/users_leave_documents', 'timestamp', 'file']), leaveDataController.applyLeave);
router.put('/reduce_leave_balance', leaveDataController.reduceLeaveBalance);
router.get('/get-all-status', leaveDataController.getAllLeaveApplications);
// router.get('/get-all-status-new', leaveDataController.getAllLeaveApplicationsNew);
router.put('/update-leave-status/:id', leaveDataController.updateLeaveStatus);
router.delete('/delete-leave-request/:id', leaveDataController.deleteLeaveApplication);

module.exports = router;  


// const express = require('express');
// const authMiddleware = require('../middleware/authMiddleware');
// const leaveDataController = require('../controllers/leaveDataController');
// const router = express.Router();

// router.get('/', authMiddleware, leaveDataController.getAllLeaveData);
// router.put('/admin/:user_id', authMiddleware, leaveDataController.updateLeaveData);
// router.post('/apply_leave', authMiddleware, leaveDataController.applyLeave);
// router.put('/reduce_leave_balance', authMiddleware, leaveDataController.reduceLeaveBalance);
// router.get('/get-all-status', authMiddleware, leaveDataController.getAllLeaveApplications);
// router.put('/update-leave-status/:id', authMiddleware, leaveDataController.updateLeaveStatus);
// router.delete('/delete-leave-request/:id', authMiddleware, leaveDataController.deleteLeaveApplication);

// module.exports = router;