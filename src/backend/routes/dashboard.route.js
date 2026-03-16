const express = require('express');
const { showDashboardPage } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/', showDashboardPage);

module.exports = router;