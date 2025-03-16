const express = require('express');
const router = express.Router();
const subAdminController = require('../controllers/subAdmin/subAdminController');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post("/create",auth.verifyToken,validator.validate('create-subadmin'), subAdminController.createSubAdmin);
// router.get("/All",auth.verifyAdmin, subAdminController.getAllSubAdmin);
router.get("/All", auth.verifyToken, subAdminController.getAllSubAdmin);
router.get("/mail-service",auth.verifyToken, subAdminController.getMailService);

// router.route('/All',auth).get(subAdminController.getAllSubAdmin);
router.route("/edit/:id").put( auth.verifyToken,subAdminController.updateSubAdmin);
router.route('/:id').get(auth.verifyToken,subAdminController.getSingleSubAdmin);
router.route('/delete/:id').delete(auth.verifyToken,subAdminController.deleteSubAdmin);

router.post("/mail-service",auth.verifyToken,validator.validate('mail-service'), subAdminController.updateMailService);
router.post("/verify-mail-service",auth.verifyToken, subAdminController.verifyMailService);


router.post("/xxx",subAdminController.getAllLeaveApplications);
router.get("/hi", (req, res) => {
    res.send("hello");
});

module.exports = router;