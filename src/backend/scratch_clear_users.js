const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'WaterQA.db');
console.log("Database path:", dbPath);

const db = new Database(dbPath);

const countQuery = db.prepare("SELECT COUNT(*) as count FROM USER");
const beforeCount = countQuery.get().count;
console.log(`Số lượng tài khoản hiện có: ${beforeCount}`);

const allUsers = db.prepare("SELECT user_id, email, name FROM USER").all();
console.table(allUsers);

// Execute delete
const deleteQuery = db.prepare("DELETE FROM USER");
const info = deleteQuery.run();
console.log(`Đã xóa thành công ${info.changes} tài khoản.`);

const afterCount = countQuery.get().count;
console.log(`Số lượng tài khoản còn lại: ${afterCount}`);
