// // initDb.js
// const db = require("./db");

// db.serialize(() => {
//   db.run(
//     `
//     CREATE TABLE IF NOT EXISTS Accounts (
//         phone varchar(12),
//         hashedPass varchar(255),
//         PRIMARY KEY (phone)
//     );
//   `,
//     (err) => {
//       if (err) {
//         console.error("Error creating table:", err.message);
//       } else {
//         console.log('Table "users" is ready!');
//       }
//     },
//   );
// });

// module.exports = db; // still export the same db

// database/initDb.js
const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS Accounts (
    phone VARCHAR(12),
    hashedPass VARCHAR(255),
    PRIMARY KEY (phone)
  )
`);

console.log('Table Accounts is ready');