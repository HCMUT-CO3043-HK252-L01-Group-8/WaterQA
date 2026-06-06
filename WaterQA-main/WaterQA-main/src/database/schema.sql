PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS NOTIFICATION;
DROP TABLE IF EXISTS ALERT;
DROP TABLE IF EXISTS ALERT_THRESHOLD;
DROP TABLE IF EXISTS AI_PREDICTION;
DROP TABLE IF EXISTS SENSOR;
DROP TABLE IF EXISTS OBSERVATION;
DROP TABLE IF EXISTS IOT_STATION;
DROP TABLE IF EXISTS USER;

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;

-- 1. USER
CREATE TABLE USER (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin','User')),
    verification_status INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 2. IOT_STATION
CREATE TABLE IOT_STATION (
    station_id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT NOT NULL,
    location TEXT,
    status TEXT NOT NULL,
    installed_at DATETIME NOT NULL,
    last_heartbeat DATETIME,
    description TEXT
);

-- 3. SENSOR
CREATE TABLE SENSOR (
    sensor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER NOT NULL,
    sensor_name TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    unit TEXT,
    status TEXT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES IOT_STATION(station_id)
);

-- 4. OBSERVATION
CREATE TABLE OBSERVATION (
    observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER NOT NULL,
    light_intensity REAL,
    water_level REAL,
    temperature REAL,
    humidity REAL,
    tank_surface_moisture REAL,
    lid_status INTEGER,
    leakage_signal INTEGER,
    intrusion_signal INTEGER,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES IOT_STATION(station_id)
);

-- 5. AI_PREDICTION
CREATE TABLE AI_PREDICTION (
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

-- 6. ALERT_THRESHOLD
CREATE TABLE ALERT_THRESHOLD (
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
-- 7. ALERT
CREATE TABLE ALERT (
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

-- 8. NOTIFICATION
CREATE TABLE NOTIFICATION (
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

-- INDEX
CREATE INDEX IF NOT EXISTS idx_observation_station_time ON OBSERVATION(station_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_alert_station ON ALERT(station_id);
