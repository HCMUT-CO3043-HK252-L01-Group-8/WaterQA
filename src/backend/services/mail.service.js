// src/backend/services/mail.service.js
// Sử dụng Brevo HTTP API thay vì SMTP để tránh Railway block port 587
require('dotenv').config();

const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME = 'WaterQA Alert System';

/**
 * Gửi email qua Brevo Transactional Email API (HTTP)
 * Không dùng SMTP vì Railway block port 587/465
 */
const sendEmailViaBrevoAPI = async (toEmail, subject, htmlContent) => {
    const payload = {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: toEmail }],
        subject,
        htmlContent
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Brevo API lỗi ${response.status}: ${errText}`);
    }

    const result = await response.json();
    return result.messageId;
};

const sendAlertEmail = async (toEmail, alertData) => {
    try {
        const subject = `CẢNH BÁO NGUY HIỂM: WQI Vượt Ngưỡng Tại ${alertData.stationName}`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ff4d4f; border-radius: 8px; padding: 20px; max-width: 600px;">
                <h2 style="color: #ff4d4f; text-align: center;">PHÁT HIỆN CHẤT LƯỢNG NƯỚC BẤT THƯỜNG</h2>
                <p>Chào Quản trị viên,</p>
                <p>Hệ thống AquaWatch vừa ghi nhận các chỉ số vượt ngưỡng an toàn. Chi tiết như sau:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Trạm Quan Trắc:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${alertData.stationName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Thời gian:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString('vi-VN')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Chỉ số WQI:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd; color: red; font-weight: bold;">${alertData.wqi}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Ghi chú:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${alertData.message}</td>
                    </tr>
                </table>
                <p style="margin-top: 20px;">Vui lòng đăng nhập hệ thống để kiểm tra và xử lý sự cố ngay lập tức!</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động từ hệ thống WaterQA. Vui lòng không trả lời email này.</p>
            </div>
        `;

        const messageId = await sendEmailViaBrevoAPI(toEmail, subject, htmlContent);
        console.log(`Email cảnh báo đã được gửi thành công tới ${toEmail}: ${messageId}`);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
        return false;
    }
};

const sendOTPEmail = async (toEmail, otp) => {
    try {
        const subject = '[WaterQA] Mã OTP đặt lại mật khẩu';
        const htmlContent = `
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
        `;

        const messageId = await sendEmailViaBrevoAPI(toEmail, subject, htmlContent);
        console.log(`Email OTP đã được gửi thành công tới ${toEmail}: ${messageId}`);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email OTP:', error.message);
        throw error;
    }
};

module.exports = {
    sendAlertEmail,
    sendOTPEmail
};