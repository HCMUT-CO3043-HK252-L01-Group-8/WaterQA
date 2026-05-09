const db = require('../database/db');

class DeviceRepository {
    findAll() {
        return db.prepare('SELECT * FROM SENSOR ORDER BY station_id ASC').all();
    }
    findById(sensor_id) {
        return db.prepare('SELECT * FROM SENSOR WHERE sensor_id = ?').get(sensor_id);
    }
    countRows() {
        return db.prepare('SELECT COUNT(*) AS total FROM SENSOR').get();
    }
    
    updateStatus(sensor_id, newStatus) {
        db
        .prepare('UPDATE SENSOR SET status = ? WHERE sensor_id = ?')
        .run(newStatus, sensor_id);
    }
    add(sensor_id, station_id, sensor_name, sensor_type, unit, status) {
        const stmt = db
        .prepare('INSERT INTO SENSOR (sensor_id, station_id, sensor_name, sensor_type, unit, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run([sensor_id, station_id, sensor_name, sensor_type, unit, status]);
    }
    rename(sensor_id, newName) {
        const stmt = db
        .prepare('UPDATE SENSOR SET sensor_name = ? WHERE sensor_id = ?')
        .run(newName, sensor_id);
    }
}

module.exports = new DeviceRepository();