const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login/loginController');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post("/",validator.validate('login'), loginController.userLogin);
router.post("/register",validator.validate('register'), loginController.userRegister);
router.post("/send-otp", loginController.sendOTP);
router.post("/verify-otp", loginController.verifyOTP);
router.get("/getProfile/:id", loginController.getUserProfile);
router.post("/changePassword",validator.validate('change-password'), loginController.changePassword);
router.put("/updateProfile/:id", loginController.updateProfile);

module.exports = router;