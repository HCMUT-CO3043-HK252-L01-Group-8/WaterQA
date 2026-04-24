const deviceRepo = require('../repositories/device.repo');

class DeviceService {
    getAll() {
        return deviceRepo.findAll();
    }

    getById(sensorId) {
        return deviceRepo.findById(sensorId);
    }

    switchSensor(sensorId) {
        const sensor = deviceRepo.findById(sensorId);
        if (!sensor) {
            throw new Error('Sensor not found');
        }
        const newStatus = sensor.status === 'active' ? 'inactive' : 'active';
        deviceRepo.updateStatus(sensorId, newStatus);
    }

    addSensor(station_id, sensor_name, sensor_type, unit, status) {
        const nowCount = deviceRepo.countRows().total;
        const newId = nowCount + 1; // simple way to generate new id, not ideal for production
        const DEFAULT_STATUS = 'inactive';
        try {
            deviceRepo.add(newId, station_id, sensor_name, sensor_type, unit, status || DEFAULT_STATUS);
        } catch (err) {
            throw new Error('Failed to add sensor: ' + err.message);
        }
    }

    renameSensor(sensorId, newName) {
        const sensor = deviceRepo.findById(sensorId);
        if (!sensor) {
            throw new Error('Sensor not found');
        }
        try {
            deviceRepo.rename(sensorId, newName);
        } catch (err) {
            throw new Error('Failed to rename sensor: ' + err.message);
        }
    }
}

module.exports = new DeviceService();