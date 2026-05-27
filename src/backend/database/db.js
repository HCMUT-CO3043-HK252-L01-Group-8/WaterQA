// database/db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', '..', 'data', 'WaterQA.db');

const db = new Database(dbPath, {
  // verbose: console.log, // Disabled for cleaner logs
  // fileMustExist: true, // optional: throw if db file missing
});

module.exports = db;
