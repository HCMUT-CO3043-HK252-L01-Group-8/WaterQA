// routes/auth.routes.js
const express = require('express');
const { showLoginPage, login, logout } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/login', showLoginPage);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;