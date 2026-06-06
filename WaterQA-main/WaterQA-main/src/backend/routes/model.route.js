
const express = require('express');
const router = express.Router();

const { predictPotability } = require('../controllers/model.controller');

// just raw json for now
router.post('/predict-potability', predictPotability);

module.exports = router
