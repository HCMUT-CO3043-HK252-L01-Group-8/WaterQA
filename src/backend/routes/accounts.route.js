// routes/accounts.routes.js
const express = require('express');
const { getAll, checkByPhone, showSignupPage, signup, showChangePasswordPage, changePassword } = require('../controllers/accounts.controller');

const router = express.Router();

// GET /accounts/all
router.get('/all', getAll);
router.get('/id/:phone', checkByPhone);
router.get('/signup', showSignupPage);
router.post('/signup', signup);
router.get('/changePassword', showChangePasswordPage);
router.post('/changePassword', changePassword);


module.exports = router;