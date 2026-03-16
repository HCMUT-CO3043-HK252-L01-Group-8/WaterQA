// routes/accounts.routes.js
const express = require('express');
const { getAll, checkByPhone, showSignupPage, signup } = require('../controllers/accounts.controller');

const router = express.Router();

// GET /accounts/all
router.get('/all', getAll);
router.get('/id/:phone', checkByPhone);
router.get('/signup', showSignupPage);
router.post('/signup', signup);


module.exports = router;