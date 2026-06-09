// database/initSchema.js
// Khởi tạo database schema AN TOÀN — chỉ tạo bảng nếu chưa tồn tại
// Không DROP bảng → không mất data khi restart

const db = require('./db');

function initSchema() {
    db.exec(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;

        CREATE TABLE IF NOT EXISTS USER (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            phone_number TEXT,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('Admin','User')),
            verification_status INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME,
            email_notifications INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS IOT_STATION (
            station_id INTEGER PRIMARY KEY AUTOINCREMENT,
            station_name TEXT NOT NULL,
            location TEXT,
            status TEXT NOT NULL,
            installed_at DATETIME NOT NULL,
            last_heartbeat DATETIME,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS SENSOR (
            sensor_id INTEGER PRIMARY KEY AUTOINCREMENT,
            station_id INTEGER NOT NULL,
            sensor_name TEXT NOT NULL,
            sensor_type TEXT NOT NULL,
            unit TEXT,
            status TEXT NOT NULL,
            FOREIGN KEY (station_id) REFERENCES IOT_STATION(station_id)
        );

        CREATE TABLE IF NOT EXISTS OBSERVATION (
            observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            station_id INTEGER NOT NULL,
            ph REAL,
            hardness REAL,
            solids REAL,
            chloramines REAL,
            sulfate REAL,
            conductivity REAL,
            organic_carbon REAL,
            trihalomethanes REAL,
            turbidity REAL,
            timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (station_id) REFERENCES IOT_STATION(station_id)
        );

        CREATE TABLE IF NOT EXISTS AI_PREDICTION (
            prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            observation_id INTEGER NOT NULL UNIQUE,
            predicted_at DATETIME NOT NULL,
            result TEXT NOT NULL,
            confidence REAL,
            model_name TEXT,
            risk_level TEXT,
            recommendation TEXT,
            FOREIGN KEY (observation_id) REFERENCES OBSERVATION(observation_id)
        );

        CREATE TABLE IF NOT EXISTS ALERT_THRESHOLD (
            threshold_id INTEGER PRIMARY KEY AUTOINCREMENT,
            station_id INTEGER,
            parameter_name TEXT NOT NULL,
            lower_threshold REAL NOT NULL,
            upper_threshold REAL NOT NULL,
            severity_level TEXT NOT NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            set_by_user_id INTEGER NOT NULL,
            FOREIGN KEY (station_id) REFERENCES IOT_STATION(station_id),
            FOREIGN KEY (set_by_user_id) REFERENCES USER(user_id),
            CHECK(lower_threshold <= upper_threshold)
        );

        CREATE TABLE IF NOT EXISTS ALERT (
            alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
            observation_id INTEGER,
            station_id INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            severity TEXT NOT NULL CHECK(severity IN ('low','medium','high','critical')),
            description TEXT,
            status TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at DATETIME,
            FOREIGN KEY (observation_id) REFERENCES OBSERVATION(observation_id),
            FOREIGN KEY (station_id) REFERENCES IOT_STATION(station_id)
        );

        CREATE TABLE IF NOT EXISTS NOTIFICATION (
            notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
            alert_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            channel TEXT NOT NULL,
            sent_at DATETIME,
            send_status TEXT NOT NULL,
            retry_count INTEGER DEFAULT 0 CHECK(retry_count >= 0),
            FOREIGN KEY (alert_id) REFERENCES ALERT(alert_id),
            FOREIGN KEY (user_id) REFERENCES USER(user_id)
        );

        CREATE TABLE IF NOT EXISTS OTP (
            email TEXT PRIMARY KEY,
            otp TEXT NOT NULL,
            expires_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_observation_station_time ON OBSERVATION(station_id, timestamp);
        CREATE INDEX IF NOT EXISTS idx_alert_station ON ALERT(station_id);
    `);

    // Seed admin user nếu chưa có ai
    const count = db.prepare('SELECT COUNT(*) as cnt FROM USER').get();
    if (count.cnt === 0) {
        const now = new Date().toISOString();
        db.prepare(`
            INSERT INTO USER (name, email, phone_number, password_hash, role, verification_status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run('Admin', 'admin@waterqa.com', null, 'admin123', 'Admin', 1, now, now);
        console.log('[DB] Seeded default admin: admin@waterqa.com / admin123');
    }

    // Seed 4 default IoT stations
    const countStations = db.prepare('SELECT COUNT(*) as cnt FROM IOT_STATION').get();
    if (countStations.cnt < 4) {
        const now = new Date().toISOString();
        const stmt = db.prepare(`INSERT INTO IOT_STATION (station_name, location, status, installed_at) VALUES (?, ?, ?, ?)`);
        db.exec('DELETE FROM IOT_STATION'); // Xóa cũ nếu có < 4 trạm để insert lại ID 1-4
        stmt.run('Trạm 1', '268 Lý Thường Kiệt', 'Active', now);
        stmt.run('Trạm 2', 'KTX Khu A - ĐHQG', 'Active', now);
        stmt.run('Trạm 3', 'Khu Công Nghệ Cao', 'Active', now);
        stmt.run('Trạm 4', 'Hồ Đá - Làng Đại Học', 'Active', now);
        console.log('[DB] Seeded 4 default IoT Stations');
    }

    console.log('[DB] Schema initialized successfully');
}

module.exports = { initSchema };
