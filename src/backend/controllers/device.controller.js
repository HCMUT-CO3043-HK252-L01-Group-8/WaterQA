const deviceService = require('../services/device.service');

// function getAll_raw(req, res) {
//     try {
//         const devices = deviceService.getAll();
//         res.status(200).json({ success: true, payload: devices, timestamp: new Date().toISOString() });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }

function getAll(req, res) {
    try {
        const devices = deviceService.getAll();
        // res.render('devices', { devices });
        res.status(200).json({ success: true, payload: devices, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
}

function getById(req, res){
    try {
        const sensorId = req.params.id;
        const device = deviceService.getById(sensorId);
        if (!device) {
            return res.status(404).json({ success: false, error: 'Device not found', timestamp: new Date().toISOString() });
        }
        res.status(200).json({ success: true, payload: device, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
}

// obsoleted
function switchSensor(req, res) {
    const sensorId = req.params.id;
    try {
        deviceService.switchSensor(sensorId);
        res.status(200).json({ success: true, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
}

function addSensor(req, res) {
    const { station_id, sensor_name, sensor_type, unit, status } = req.body;
    try {
        deviceService.add(station_id, sensor_name, sensor_type, unit, status);
        // res.redirect('/devices/all');
        res.status(201).json({ success: true, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).send('Error adding device');
    }
}

function renameSensor(req, res) {
    const sensorId = req.params.id;
    const { newName } = req.body;
    try {
        deviceService.renameSensor(sensorId, newName);
        // res.redirect('/devices/all');
        res.status(200).json({ success: true, timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
}

module.exports = {
    getAll,
    getById,
    switchSensor,
    addSensor,
    renameSensor
};