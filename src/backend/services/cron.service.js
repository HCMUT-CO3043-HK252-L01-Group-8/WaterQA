// src/backend/services/cron.service.js
const cron = require('node-cron');
const mailService = require('./mail.service');
const dataRepo = require('../repositories/data.repo');
const dataService = require('./data.service');
//Lay tu feed key tren Adafruit IO, neu muon check ca 2 feed cung luc 
//thi de trong array, neu chi check 1 feed thi de 1 phan tu trong array nhu duoi
const FEEDS_TO_MONITOR = ['temperature', 'humidity']; //Vd chu chua co feedkey
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; //Co the doi mail de test
const startDeviceMonitor = () => {
    console.log("Bắt đầu chạy Cron Service giám sát thiết bị IoT...");
    setInterval(async () => {
        try {
            const thresholds = await dataService.getThresholdsRaw();

            for (let feedKey of FEEDS_TO_MONITOR) {
                const response = await dataService.getTelemetryData(feedKey, 1);
                if (!response || !response.data || response.data.length === 0) {
                    console.log(`Bỏ qua feed [${feedKey}] do không lấy được dữ liệu từ Adafruit.`);
                    continue; 
                }
                const data = response.data;
                const latestValue = parseFloat(data[0].value);
                const recordTime = new Date(data[0].created_at).toLocaleString('vi-VN');
                //IOT devices co errors, uu tien may loi truoc, vuot thresholds sau
                let isHardwareError = false;
                if (feedKey === 'temperature' && (latestValue < -10 || latestValue > 80)) isHardwareError = true;
                if (feedKey === 'humidity' && (latestValue < 0 || latestValue > 100)) isHardwareError = true;
                //Vi du feedkey va gia tri
                if (feedKey === 'ph' && (latestValue < 0 || latestValue > 14)) isHardwareError = true;

                if (isHardwareError) {
                    const errorData = {
                        stationName: 'Trạm IoT',
                        wqi: 'LỖI CẢM BIẾN / PHẦN CỨNG',
                        message: `Phát hiện dữ liệu bất thường từ cảm biến [${feedKey.toUpperCase()}]. Giá trị đo được là ${latestValue}. Có thể thiết bị đã bị hỏng hoặc chập mạch, vui lòng kiểm tra ngay lập tức! (Đo lúc: ${recordTime})`
                    };
                    await mailService.sendAlertEmail(ADMIN_EMAIL, errorData);
                    console.log(`[CẢNH BÁO] Đã gửi mail lỗi phần cứng cho feed: ${feedKey}`);
                    
                //Kiem tra vuot nguong chi khi khong co loi phan cung, neu co loi phan cung roi thi khong can check vuot nguong nua
                    continue; 
                }
                const feedThreshold = thresholds.find(t => t.parameter.toLowerCase() === feedKey.toLowerCase());
                
                if (feedThreshold) {
                    const { lower_threshold, upper_threshold } = feedThreshold;
                    
                    if (latestValue < lower_threshold || latestValue > upper_threshold) {
                        const alertData = {
                            stationName: 'Trạm IoT (Hệ thống WaterQA)',
                            wqi: `VƯỢT NGƯỠNG (${latestValue})`,
                            message: `Cảnh báo: Chỉ số [${feedKey.toUpperCase()}] hiện tại là ${latestValue}, vượt ra khỏi giới hạn an toàn cho phép (từ ${lower_threshold} đến ${upper_threshold}). Vui lòng kiểm tra chất lượng nước! (Đo lúc: ${recordTime})`
                        };
                        await mailService.sendAlertEmail(ADMIN_EMAIL, alertData);
                        console.log(`[CẢNH BÁO] Đã gửi mail vượt ngưỡng cho feed: ${feedKey}`);
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi trong quá trình chạy hệ thống giám sát tự động:", error.message);
        }
    }, 60000); // 60000 ms = 1p quet 1 lan (de test, chinh thuc co the de 5p = 300000ms)
};
module.exports = { startDeviceMonitor };