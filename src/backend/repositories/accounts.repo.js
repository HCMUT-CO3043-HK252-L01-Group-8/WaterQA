// repositories/accounts.repository.js
const db = require("../database/db");

class AccountsRepository {
  constructor() {
    // Ensure column exists (safe migration)
    try {
      db.prepare("ALTER TABLE USER ADD COLUMN email_notifications INTEGER DEFAULT 1").run();
    } catch (_) { /* column already exists */ }
  }

  findAll() {
    return db
      .prepare("SELECT * FROM USER ORDER BY user_id")
      .all();
  }
  countRows() {
    return db.prepare("SELECT COUNT(*) AS total FROM USER").get();
  }
  getMaxUserId() {
    return db.prepare("SELECT MAX(user_id) AS max_id FROM USER").get();
  }
  findByPhone(phone) {
    return db
      // .prepare("SELECT phone, hashedPass FROM Accounts WHERE phone=?")
      .prepare("SELECT phone_number, password_hash FROM USER WHERE phone_number=?")
      .get([phone]);
  }
  findById(id) {
    return db
      .prepare("SELECT * FROM USER WHERE user_id=?")
      .all([id]);
  }
  findByEmail(email) {
    return db
      .prepare("SELECT * FROM USER WHERE email=?")
      .all([email]);
  }
  addAccount(id, mail, phone, password, role, verif, createdAt, name) {
    return db
      .prepare("INSERT INTO USER (user_id, name, email, phone_number, password_hash, role, verification_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run([id, name || null, mail, phone, password, role, verif, createdAt, createdAt]);
  }
  changePassword(id, newPassword, updateTime) {
    return db
      // .prepare("UPDATE Accounts SET hashedPass=? WHERE phone=?")
      .prepare("UPDATE USER SET password_hash=?, updated_at=? WHERE user_id=?")
      .run([newPassword, updateTime, id]);
  }
  deleteAccount(id){
    return db
      .prepare("DELETE FROM USER WHERE user_id=?")
      .run([id]);
  }
  // Dùng cho luồng reset-password qua OTP (tìm theo email)
  updatePassword(email, newPassword) {
    const now = new Date().toISOString();
    return db
      .prepare("UPDATE USER SET password_hash=?, updated_at=? WHERE email=?")
      .run([newPassword, now, email]);
  }
  updateEmailNotifications(userId, enabled) {
    const now = new Date().toISOString();
    return db
      .prepare("UPDATE USER SET email_notifications=?, updated_at=? WHERE user_id=?")
      .run([enabled ? 1 : 0, now, userId]);
  }
}

module.exports = new AccountsRepository();