// repositories/accounts.repository.js
// const db = require("../database/db");
const db = require("../database/db");

class AccountsRepository {
  findAll() {
    return db
      // .prepare("SELECT phone, hashedPass FROM Accounts ORDER BY phone")
      .prepare("SELECT * FROM USER ORDER BY phone_number")
      .all();
  }
  countRows(){
  return db.prepare("SELECT COUNT(*) AS total FROM USER").get();
  }
  findByPhone(phone) {
    return db
      // .prepare("SELECT phone, hashedPass FROM Accounts WHERE phone=?")
      .prepare("SELECT phone_number, password_hash FROM USER WHERE phone_number=?")
      .get([phone]);
  }
  findById(id){
    return db
      .prepare("SELECT * FROM USER WHERE user_id=?")
      .all([id]);
  }
  addAccount(id, mail, phone, password, role, verif, createdAt) {
    return db
      // .prepare("INSERT INTO Accounts VALUES (?, ?)")
      .prepare("INSERT INTO USER (user_id, email, phone_number, password_hash, role, verification_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run([id, mail, phone, password, role, verif, createdAt, createdAt]);
  }
  changePassword(id, newPassword, updateTime) {
    return db
      // .prepare("UPDATE Accounts SET hashedPass=? WHERE phone=?")
      .prepare("UPDATE USER SET password_hash=?, updated_at=? WHERE user_id=?")
      .run([newPassword, updateTime, id]);
  }
}

module.exports = new AccountsRepository();
