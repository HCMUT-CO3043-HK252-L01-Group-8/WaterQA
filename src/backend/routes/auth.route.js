// routes/auth.routes.js
const express = require('express');
// const { showLoginPage, login, logout } = require('../controllers/auth.controller');
const authCtrl = require('../controllers/auth.controller');
const {requireLogin} = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/login', authCtrl.showLoginPage);
router.post('/login', authCtrl.login);
router.post('/google', authCtrl.loginWithGoogle);
router.delete('/logout', authCtrl.logout);
router.get('/me', requireLogin, authCtrl.getMySession);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/verify-otp', authCtrl.verifyOTP);
router.post('/reset-password', authCtrl.resetPassword);

module.exports = router;