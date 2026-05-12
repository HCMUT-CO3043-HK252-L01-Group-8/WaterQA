const accountsRepo = require("../repositories/accounts.repo");
const otpRepo = require("../repositories/otp.repo");
const nodemailer = require("nodemailer");

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 phút

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"WaterQA" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '[WaterQA] Mã OTP đặt lại mật khẩu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #00A89D;">WaterQA - Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã OTP bên dưới:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #00A89D; text-align: center; padding: 20px; background: #f5f8f8; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666;">Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
        <p style="color: #666;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px;">WaterQA - Hệ thống giám sát chất lượng nước</p>
      </div>
    `,
  });
}

class AuthService {
  login(id, password) {
    // id parameter contains email from frontend
    const users = accountsRepo.findByEmail(id);
    if (users.length <= 0) { return { err: 404, user: null }; } // user not found

    const user = users[0];
    if (password != user.password_hash) {
      return { err: 422, user: null }; // wrong password
    }
    return { err: 0, user: user };
  }

  loginWithGoogle(googleUser) {
    // googleUser = { name, email, picture }
    const { name, email, picture } = googleUser;
    
    // Try to find user by email
    const users = accountsRepo.findByEmail(email);
    
    let user;
    if (users.length > 0) {
      // User exists, use them
      user = users[0];
    } else {
      // Create new user from Google info
      try {
        const now = new Date().toISOString();
        accountsRepo.addAccount(
          null, // auto-increment id
          email,
          null, // phone
          'GOOGLE_OAUTH', // password_hash (using placeholder)
          'User', // role
          1, // verification_status (verified via Google)
          now,
          name || null // lưu tên từ Google
        );
        
        // Get the newly created user
        const newUsers = accountsRepo.findByEmail(email);
        if (newUsers.length > 0) {
          user = newUsers[0];
        } else {
          return { err: 500, user: null };
        }
      } catch (err) {
        console.error('Error creating Google user:', err);
        return { err: 500, user: null };
      }
    }

    return { err: 0, user: user };
  }

  // Gửi OTP về email để đặt lại mật khẩu
  async forgotPassword(email) {
    const users = accountsRepo.findByEmail(email);
    if (users.length <= 0) {
      return { err: 404, message: 'Email không tồn tại trong hệ thống' };
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    // Lưu vào SQLite (tồn tại qua server restart)
    otpRepo.upsert(email, otp, expiresAt);
    otpRepo.deleteExpired(); // dọn dẹp OTP cũ

    // Luôn log OTP ra console để debug (dev mode)
    console.log(`\n[OTP] ========================================`);
    console.log(`[OTP] Email: ${email}`);
    console.log(`[OTP] Code:  ${otp}`);
    console.log(`[OTP] Expires: ${new Date(expiresAt).toISOString()}`);
    console.log(`[OTP] ========================================\n`);

    try {
      await sendOTPEmail(email, otp);
      console.log(`[OTP] Email sent successfully to ${email}`);
      return { err: 0 };
    } catch (emailErr) {
      console.error('[OTP] Failed to send email. Code:', emailErr.code, '| Message:', emailErr.message);
      console.warn('[OTP] SMTP failed but OTP is logged above. Use the console OTP to test.');
      // Vẫn trả về success - OTP đã được lưu trong memory, dùng từ console
      return { err: 0 };
    }
  }

  // Xác thực OTP (không đổi mật khẩu)
  verifyOTP(email, otp) {
    const record = otpRepo.findByEmail(email);
    console.log(`[verifyOTP] email=${email} otp=${otp} record=`, record);

    if (!record) {
      return { err: 400, message: 'Mã OTP không hợp lệ hoặc chưa được yêu cầu' };
    }
    if (Date.now() > record.expires_at) {
      otpRepo.deleteByEmail(email);
      return { err: 400, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' };
    }
    if (record.otp !== otp) {
      return { err: 400, message: 'Mã OTP không đúng' };
    }

    // OTP hợp lệ, không xóa - sẽ dùng lại trong resetPassword
    return { err: 0 };
  }

  // Xác thực OTP và đặt mật khẩu mới
  resetPassword(email, otp, newPassword) {
    const record = otpRepo.findByEmail(email);
    console.log(`[resetPassword] email=${email} otp=${otp} record=`, record);

    if (!record) {
      return { err: 400, message: 'Mã OTP không hợp lệ hoặc chưa được yêu cầu' };
    }
    if (Date.now() > record.expires_at) {
      otpRepo.deleteByEmail(email);
      return { err: 400, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' };
    }
    if (record.otp !== otp) {
      console.log(`[resetPassword] OTP mismatch: expected=${record.otp} got=${otp}`);
      return { err: 400, message: 'Mã OTP không đúng' };
    }

    // OTP hợp lệ -> đổi mật khẩu
    try {
      accountsRepo.updatePassword(email, newPassword);
      otpRepo.deleteByEmail(email); // Xóa OTP sau khi dùng
      return { err: 0 };
    } catch (dbErr) {
      console.error('[OTP] Failed to update password:', dbErr);
      return { err: 500, message: 'Không thể cập nhật mật khẩu. Vui lòng thử lại.' };
    }
  }
}

module.exports = new AuthService();
