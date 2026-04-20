const express = require('express');
const deviceCtrl = require('../controllers/device.controller');

const router = express.Router();

// just raw json for now
// router.get('/all-raw', deviceCtrl.getAll_raw);
router.get('/all', deviceCtrl.getAll);
router.get('/id/:id', deviceCtrl.getById);

// obsoleted
// router.get('/switch-sensor/:id', deviceCtrl.switchSensor);

router.put('/rename/:id', deviceCtrl.renameSensor);

// router.post('/add', deviceCtrl.addSensor);
// router.put('/update/:id', deviceCtrl.update);
// router.delete('/delete/:id', deviceCtrl.delete);

module.exports = router;