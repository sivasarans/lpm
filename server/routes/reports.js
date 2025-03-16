const express = require('express');
const reportsController = require('../controllers/reportsController');
const router = express.Router();

router.get('/', reportsController.generateReport);

module.exports = router;