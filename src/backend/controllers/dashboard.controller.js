const mailService = require('../services/mail.service');

function showDashboardPage(req, res) {
  // requireLogin(req, res, () => { console.log('Login successfully'); });
  const phone = req.session.user?.phone_number || null;
  res.render('dashboard', { phone: phone });
}

/**
 * Hàm test API gửi email cảnh báo qua Brevo
 */
const testEmailAlert = async (req, res) => {
    try {
        const adminEmail = req.body.email; 
        
        // Kiểm tra xem user có truyền email vào body không
        if (!adminEmail) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email người nhận trong body request.' });
        }

        // Dữ liệu giả lập để test template email
        const mockAlertData = {
            stationName: '268 Lý Thường Kiệt, Q10',
            wqi: '45 (Rất thấp)',
            message: 'Độ đục và chỉ số pH vượt ngưỡng giới hạn cho phép.'
        };

        // Gọi service gửi mail
        const isSent = await mailService.sendAlertEmail(adminEmail, mockAlertData);

        if (isSent) {
            return res.status(200).json({ message: 'Gửi email cảnh báo thành công qua Brevo!' });
        } else {
            return res.status(500).json({ message: 'Không thể gửi email lúc này. Vui lòng kiểm tra log server.' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
  showDashboardPage,
  testEmailAlert
};