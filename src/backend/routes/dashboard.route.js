const express = require('express');
const { showDashboardPage } = require('../controllers/dashboard.controller');
const { requireLogin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', requireLogin, showDashboardPage);

module.exports = router;