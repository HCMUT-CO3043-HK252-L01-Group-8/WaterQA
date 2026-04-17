// src/backend/services/mail.service.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Cấu hình transporter kết nối tới Brevo SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // false cho port 587, true nếu dùng port 465
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY
    }
});

/**
 * Hàm gửi email cảnh báo
 * @param {string} toEmail - Email người nhận
 * @param {object} alertData - Dữ liệu cảnh báo
 */
const sendAlertEmail = async (toEmail, alertData) => {
    try {
        const mailOptions = {
            from: `"WaterQA Alert System" <${process.env.BREVO_SENDER_EMAIL}>`, // Gửi từ email Brevo
            to: toEmail,
            subject: `CẢNH BÁO NGUY HIỂM: WQI Vượt Ngưỡng Tại ${alertData.stationName}`,
            html: `
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
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email cảnh báo đã được gửi thành công: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return false;
    }
};

module.exports = {
    sendAlertEmail
};