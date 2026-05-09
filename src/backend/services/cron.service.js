// src/backend/services/cron.service.js
const cron = require('node-cron');
const mailService = require('./mail.service');
const dataRepo = require('../repositories/data.repo');

const startDeviceMonitor = () => {
    // Chạy kiểm tra mỗi 15 phút (Cú pháp: */15 * * * *)
    cron.schedule('*/15 * * * *', async () => {
        console.log('[CRON] Đang quét kiểm tra kết nối các thiết bị IoT...');
        
        try {
            // Tìm các trạm không có dữ liệu mới trong 30 phút qua
            const offlineDevices = await dataRepo.getOfflineDevices(30);
            
            // Nếu phát hiện có thiết bị offline, gửi mail cảnh báo
            if (offlineDevices && offlineDevices.length > 0) {
                offlineDevices.forEach(device => {
                    // Xử lý chuỗi thời gian cho đẹp, nếu null tức là trạm mới lắp chưa từng có data
                    const lastActiveTime = device.lastActive 
                        ? new Date(device.lastActive).toLocaleString('vi-VN') 
                        : 'Chưa từng gửi dữ liệu';

                    const alertData = {
                        stationName: device.name,
                        wqi: 'OFFLINE (MẤT KẾT NỐI)',
                        message: `CẢNH BÁO: Trạm đã ngừng gửi dữ liệu từ lúc [${lastActiveTime}]. Vui lòng kiểm tra lại nguồn điện hoặc kết nối WiFi của thiết bị.`
                    };
                    
                    // Gửi mail (TEST: sau sửa lại email người dùng)
                    mailService.sendAlertEmail('taikhoanneverdie17@gmail.com', alertData)
                        .catch(err => console.error('Lỗi gửi mail cron:', err));
                        
                    console.log(`Đã phát hiện và gửi cảnh báo Offline cho trạm: ${device.name}`);
                });
            } else {
                console.log('Tất cả thiết bị IoT đều đang hoạt động bình thường (Online).');
            }
        } catch (error) {
            console.error('Lỗi khi chạy cron job kiểm tra thiết bị:', error);
        }
    });
};

module.exports = { startDeviceMonitor };