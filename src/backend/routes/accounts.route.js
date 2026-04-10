// routes/accounts.routes.js
const express = require('express');
const { getAll, findById, showSignupPage, signup, showChangePasswordPage, changePassword } = require('../controllers/accounts.controller');

const router = express.Router();

// GET /accounts/all
router.get('/all', getAll);
router.get('/id/:phone', findById);
router.get('/signup', showSignupPage);
router.post('/signup', signup);
router.get('/change-password', showChangePasswordPage);
router.post('/change-password', changePassword);


module.exports = router;