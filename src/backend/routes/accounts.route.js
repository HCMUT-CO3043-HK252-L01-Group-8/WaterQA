// routes/accounts.routes.js
const express = require('express');
const accountCtrl = require('../controllers/accounts.controller');
const {requireLogin} = require('../middleware/auth.middleware');

const router = express.Router();

// GET /accounts/all
router.get('/all', accountCtrl.getAll);
router.get('/id/:id', accountCtrl.findById);
// router.get('/signup', accountCtrl.showSignupPage);
router.post('/signup', accountCtrl.signup);
// router.get('/change-password', accountCtrl.showChangePasswordPage);
router.put('/change-password', requireLogin, accountCtrl.changePassword);
router.delete('/delete/', requireLogin, accountCtrl.deleteAccount); // delete own account. Admin delete is not implemented yet.
module.exports = router;