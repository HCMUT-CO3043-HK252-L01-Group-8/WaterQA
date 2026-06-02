const express = require('express');
const deviceCtrl = require('../controllers/device.controller');

const router = express.Router();

// just raw json for now
// router.get('/all-raw', deviceCtrl.getAll_raw);
router.get('/', deviceCtrl.getAll);
router.get('/:id', deviceCtrl.getById);

// obsoleted
// router.get('/switch-sensor/:id', deviceCtrl.switchSensor);

router.patch('/:id/name', deviceCtrl.renameSensor); // for user

// Admin use following features:

// router.post('/', deviceCtrl.addSensor);
// router.put('/:id', deviceCtrl.update);
// router.delete('/:id', deviceCtrl.delete);

module.exports = router;