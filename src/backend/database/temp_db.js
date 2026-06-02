const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', '..', 'data', 'WaterQA.db');
const db = new Database(dbPath);

console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
try {
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM USER').get();
    console.log('Users count:', usersCount);
} catch (e) {
    console.log('Error counting users:', e.message);
}

try {
    const dataCount = db.prepare('SELECT COUNT(*) as count FROM DATA_SENSOR').get();
    console.log('Sensor data count:', dataCount);
} catch (e) {
    try {
        const dataCount = db.prepare('SELECT COUNT(*) as count FROM SENSOR_DATA').get();
        console.log('Sensor data count:', dataCount);
    } catch (e2) {
        console.log('Error counting sensor data:', e2.message);
    }
}

try {
    const deleteRes = db.prepare('DELETE FROM USER WHERE email = ?').run('ndkhoi13505@gmail.com');
    console.log('Deleted rows for ndkhoi13505@gmail.com:', deleteRes.changes);
} catch (e) {
    console.log('Error deleting user:', e.message);
}
