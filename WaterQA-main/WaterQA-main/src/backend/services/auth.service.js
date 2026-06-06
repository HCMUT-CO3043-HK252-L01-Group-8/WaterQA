const accountsRepo = require("../repositories/accounts.repo");
const otpRepo = require("../repositories/otp.repo");
const mailService = require("./mail.service"); // Import service đã có Brevo

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 phút

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
}

class AuthService {
  login(id, password) {
    const users = accountsRepo.findByEmail(id);
    if (users.length <= 0) { return { err: 404, user: null }; }
    const user = users[0];
    if (password != user.password_hash) {
      return { err: 422, user: null };
    }
    return { err: 0, user: user };
  }

  loginWithGoogle(googleUser) {
    const { name, email, picture } = googleUser;
    const users = accountsRepo.findByEmail(email);
    let user;
    if (users.length > 0) {
      user = users[0];
    } else {
      try {
        const now = new Date().toISOString();
        accountsRepo.addAccount(null, email, null, 'GOOGLE_OAUTH', 'User', 1, now, name || null);
        const newUsers = accountsRepo.findByEmail(email);
        if (newUsers.length > 0) user = newUsers[0];
        else return { err: 500, user: null };
      } catch (err) {
        return { err: 500, user: null };
      }
    }
    return { err: 0, user: user };
  }

  async forgotPassword(email) {
    const users = accountsRepo.findByEmail(email);
    if (users.length <= 0) {
      return { err: 404, message: 'Email không tồn tại trong hệ thống' };
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    otpRepo.upsert(email, otp, expiresAt);
    otpRepo.deleteExpired();

    console.log(`\n[OTP] ========================================`);
    console.log(`[OTP] Email: ${email}`);
    console.log(`[OTP] Code:  ${otp}`);
    console.log(`[OTP] ========================================\n`);

    try {
      // GỌI HÀM GỬI QUA BREVO TỪ MAIL SERVICE
      await mailService.sendOTPEmail(email, otp);
      console.log(`[OTP] Email sent successfully via Brevo to ${email}`);
      return { err: 0 };
    } catch (emailErr) {
      console.error('[OTP] Brevo failed:', emailErr.message);
      // Vẫn cho phép thành công để dùng OTP từ terminal nếu mail lỗi
      return { err: 0 };
    }
  }

  verifyOTP(email, otp) {
    const record = otpRepo.findByEmail(email);
    if (!record) return { err: 400, message: 'Mã OTP không hợp lệ' };
    if (Date.now() > record.expires_at) {
      otpRepo.deleteByEmail(email);
      return { err: 400, message: 'Mã OTP đã hết hạn' };
    }
    if (record.otp !== otp) return { err: 400, message: 'Mã OTP không đúng' };
    return { err: 0 };
  }

  resetPassword(email, otp, newPassword) {
    const record = otpRepo.findByEmail(email);
    if (!record || Date.now() > record.expires_at || record.otp !== otp) {
      return { err: 400, message: 'Mã OTP không hợp lệ hoặc hết hạn' };
    }
    try {
      accountsRepo.updatePassword(email, newPassword);
      otpRepo.deleteByEmail(email);
      return { err: 0 };
    } catch (dbErr) {
      return { err: 500, message: 'Lỗi cập nhật mật khẩu' };
    }
  }
}

module.exports = new AuthService();