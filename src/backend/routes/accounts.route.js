// routes/accounts.routes.js
const express = require('express');
const accountCtrl = require('../controllers/accounts.controller');
const {requireLogin} = require('../middleware/auth.middleware');

const router = express.Router();

// GET /accounts
router.get('/', accountCtrl.getAll);
router.get('/me', requireLogin, accountCtrl.getMe);
router.put('/me/email-notifications', requireLogin, accountCtrl.updateEmailNotifications);
router.get('/:id', accountCtrl.findById);
// router.get('/signup', accountCtrl.showSignupPage);
router.post('/', accountCtrl.signup);
// router.get('/change-password', accountCtrl.showChangePasswordPage);
router.put('/me/password', requireLogin, accountCtrl.changePassword);
router.delete('/me', requireLogin, accountCtrl.deleteAccount);
module.exports = router;