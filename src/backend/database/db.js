// // db.js
// const sqlite3 = require('sqlite3').verbose();

// // Create/open the database file (it will be created if it doesn't exist)
// const db = new sqlite3.Database('./database.sqlite', (err) => {
//   if (err) {
//     console.error('Error opening database:', err.message);
//   } else {
//     console.log('Connected to SQLite database.');
//   }
// });

// // Optional: Enable foreign keys (good practice)
// db.run('PRAGMA foreign_keys = ON');

// // Export the db so other files can use it
// module.exports = db;

// database/db.js
const Database = require('better-sqlite3');

const db = new Database('./database/myapp.db', {
  // Recommended options
  verbose: console.log,          // optional: logs every SQL statement (great for debug)
  // fileMustExist: true,        // optional: throw if db file missing
});

// Optional: enable foreign keys (if you use them later)
db.pragma('foreign_keys = ON');

module.exports = db;