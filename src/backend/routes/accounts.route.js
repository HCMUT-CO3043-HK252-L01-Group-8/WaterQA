// routes/accounts.routes.js
const express = require('express');
const accountCtrl = require('../controllers/accounts.controller');
const {requireLogin} = require('../middleware/auth.middleware');

const router = express.Router();

// GET /accounts/all
router.get('/all', accountCtrl.getAll);
router.get('/me', requireLogin, accountCtrl.getMe);
router.put('/me/email-notifications', requireLogin, accountCtrl.updateEmailNotifications);
router.get('/id/:id', accountCtrl.findById);
// router.get('/signup', accountCtrl.showSignupPage);
router.post('/signup', accountCtrl.signup);
// router.get('/change-password', accountCtrl.showChangePasswordPage);
router.put('/change-password', requireLogin, accountCtrl.changePassword);
router.delete('/delete/', requireLogin, accountCtrl.deleteAccount);
module.exports = router;