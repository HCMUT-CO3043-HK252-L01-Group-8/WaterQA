// database/initDb.js
const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS USER (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    phone_number TEXT UNIQUE,
    password_hash TEXT,
    role TEXT,
    verification_status INTEGER,
    created_at TEXT,
    updated_at TEXT
  );
`);

console.log('Table USER is ready');
