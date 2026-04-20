// routes/auth.routes.js
const express = require('express');
// const { showLoginPage, login, logout } = require('../controllers/auth.controller');
const authCtrl = require('../controllers/auth.controller');
const {requireLogin} = require('../middleware/auth.middleware');

const router = express.Router();

// router.get('/login', showLoginPage);
router.post('/login', authCtrl.login);
router.delete('/logout', authCtrl.logout);
router.get('/me', requireLogin, authCtrl.getMySession);

module.exports = router;