// database/db.js
const Database = require('better-sqlite3');

const db = new Database('../../data/WaterQA.db', {
  verbose: console.log,
  // fileMustExist: true,        // optional: throw if db file missing
});

module.exports = db;
