// repositories/otp.repo.js
const db = require('../database/db');

// Tạo bảng OTP_STORE nếu chưa tồn tại (auto-migrate)
db.exec(`
  CREATE TABLE IF NOT EXISTS OTP_STORE (
    email     TEXT PRIMARY KEY,
    otp       TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  )
`);

class OtpRepository {
  /** Lưu hoặc cập nhật OTP cho email */
  upsert(email, otp, expiresAt) {
    db.prepare(`
      INSERT INTO OTP_STORE (email, otp, expires_at)
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET otp=excluded.otp, expires_at=excluded.expires_at
    `).run(email, otp, expiresAt);
  }

  /** Lấy record OTP theo email */
  findByEmail(email) {
    return db.prepare('SELECT * FROM OTP_STORE WHERE email = ?').get(email);
  }

  /** Xóa OTP sau khi dùng xong */
  deleteByEmail(email) {
    db.prepare('DELETE FROM OTP_STORE WHERE email = ?').run(email);
  }

  /** Dọn dẹp các OTP đã hết hạn */
  deleteExpired() {
    db.prepare('DELETE FROM OTP_STORE WHERE expires_at < ?').run(Date.now());
  }
}

module.exports = new OtpRepository();
