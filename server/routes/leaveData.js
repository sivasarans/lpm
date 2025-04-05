const express = require('express');
const { img } = require('vamtec');
const leaveDataController = require('../controllers/leaveDataController');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/',auth.verifyToken, leaveDataController.getAllLeaveData);

router.get('/get-all-leave-balance/all-users',leaveDataController.getAllLeaveBalance);

router.put('/admin/:user_id',
    // auth.verifyToken,
     leaveDataController.updateLeaveData);
router.put('/leave-configuration',
    leaveDataController.updateConfiguration
);
router.get('/leave-configuration',
    leaveDataController.getConfiguration
);


router.post('/apply_leave', img(['uploads/users_leave_documents', 'timestamp', 'file']), auth.verifyToken,leaveDataController.applyLeave);

// router.post(
//     '/apply_leave',
//     img(['uploads/users_leave_documents', 'timestamp', 'file']), // Ensure correct multer setup
//     auth.verifyToken,
//     async (req, res) => {
//       try {
//         console.log("Received file:", req.file); // Check uploaded file
//         console.log("Received form data:", req.body); // Check form fields
  
//         if (!req.body.user_id || !req.body.leave_type) {
//           return res.status(400).json({ message: "User ID and Leave Type are required" });
//         }
  
//         const result = await leaveDataController.applyLeave(req, res);
//         res.json(result);
//       } catch (error) {
//         console.error("Error applying leave:", error);
//         res.status(500).json({ message: "Server error while applying leave" });
//       }
//     }
//   );
router.put('/reduce_leave_balance',auth.verifyToken, leaveDataController.reduceLeaveBalance);
router.get('/get-all-status',
    // auth.verifyToken, 
    leaveDataController.getAllLeaveApplications);
// router.get('/get-all-status-new', leaveDataController.getAllLeaveApplicationsNew);
router.put('/update-leave-status/:id',
    // auth.verifyToken,
     leaveDataController.updateLeaveStatus);
router.delete('/delete-leave-request/:id',auth.verifyToken, leaveDataController.deleteLeaveApplication);

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