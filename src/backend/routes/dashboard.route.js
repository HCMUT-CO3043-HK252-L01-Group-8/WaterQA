const express = require('express');
const { showDashboardPage, testEmailAlert } = require('../controllers/dashboard.controller');
const { requireLogin } = require('../middleware/auth.middleware');

const router = express.Router();

// router.get('/', requireLogin, showDashboardPage);
router.post('/test-alert', testEmailAlert);

module.exports = router;