// src/backend/services/cron.service.js
const cron = require('node-cron');
const mailService = require('./mail.service');
const dataRepo = require('../repositories/data.repo');
const dataService = require('./data.service');
const accountsRepo = require('../repositories/accounts.repo');
//Lay tu feed key tren Adafruit IO, neu muon check ca 2 feed cung luc 
//thi de trong array, neu chi check 1 feed thi de 1 phan tu trong array nhu duoi
const FEEDS_TO_MONITOR = ['temp', 'humi', 'light']; //cap nhat: dam quay chinh sach canh bao light
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; //Co the doi mail de test
const LIGHT_THRESHOLD = 70; // Mốc cảnh báo cường độ ánh sáng
const LIGHT_DURATION_MS = 10000; // 10 giây
let lightAlert = { isAlerting: false, startTime: null }; // Tracking alert state

/**
 * Gửi cảnh báo tới tất cả users (hoặc admin nếu không có users)
 */
const sendAlertToAllUsers = async (alertData) => {
    try {
        const allUsers = accountsRepo.findAll();
        
        if (allUsers && allUsers.length > 0) {
            // Gửi tới tất cả users
            for (let user of allUsers) {
                if (user.email) {
                    await mailService.sendAlertEmail(user.email, alertData);
                    console.log(`[CẢNH BÁO] Đã gửi mail tới user: ${user.email}`);
                }
            }
        } else {
            // Nếu không có users, gửi tới admin
            if (ADMIN_EMAIL) {
                await mailService.sendAlertEmail(ADMIN_EMAIL, alertData);
                console.log(`[CẢNH BÁO] Không có users, gửi tới admin: ${ADMIN_EMAIL}`);
            }
        }
    } catch (error) {
        console.error('Lỗi khi gửi cảnh báo tới users:', error);
    }
};

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
                if (feedKey === 'temp' && (latestValue < -10 || latestValue > 80)) isHardwareError = true;
                if (feedKey === 'humi' && (latestValue < 0 || latestValue > 100)) isHardwareError = true;
                if (feedKey === 'light' && (latestValue < 0 || latestValue > 100)) isHardwareError = true; //light: 0-100%

                if (isHardwareError) {
                    const errorData = {
                        stationName: 'Trạm IoT',
                        wqi: 'LỖI CẢM BIẾN / PHẦN CỨNG',
                        message: `Phát hiện dữ liệu bất thường từ cảm biến [${feedKey.toUpperCase()}]. Giá trị đo được là ${latestValue}. Có thể thiết bị đã bị hỏng hoặc chập mạch, vui lòng kiểm tra ngay lập tức! (Đo lúc: ${recordTime})`
                    };
                    await sendAlertToAllUsers(errorData);
                    console.log(`[CẢNH BÁO] Đã gửi mail lỗi phần cứng cho feed: ${feedKey}`);
                    
                //Kiem tra vuot nguong chi khi khong co loi phan cung, neu co loi phan cung roi thi khong can check vuot nguong nua
                    continue; 
                }
                // Xử lý Light - cảnh báo mở nắp (light > 70 trong 10s)
                if (feedKey === 'light') {
                    if (latestValue > LIGHT_THRESHOLD) {
                        if (!lightAlert.isAlerting) {
                            // Bắt đầu tracking
                            lightAlert.isAlerting = true;
                            lightAlert.startTime = Date.now();
                            console.log(`[LIGHT] Phát hiện ánh sáng cao (${latestValue}%) lúc ${recordTime}. Theo dõi trong 10s...`);
                        } else {
                            // Kiểm tra xem đã vượt quá 10s chưa
                            const elapsedTime = Date.now() - lightAlert.startTime;
                            if (elapsedTime >= LIGHT_DURATION_MS) {
                                // Gửi cảnh báo
                                const alertData = {
                                    stationName: 'Trạm IoT (Hệ thống WaterQA)',
                                    wqi: 'CẢNH BÁO MỞ NẮP',
                                    message: `CẢNH BÁO KHẨN CẤP: Phát hiện ánh sáng cao (${latestValue}%) liên tục trong 10 giây! Có thể có người mở nắp bồn chứa hoặc có ánh sáng ngoài xâm nhập. Vui lòng kiểm tra ngay lập tức! (Ghi nhận lúc: ${recordTime})`
                                };
                                await sendAlertToAllUsers(alertData);
                                console.log(`[CẢNH BÁO] Đã gửi mail cảnh báo MỞ NẮP - Light: ${latestValue}%`);
                                lightAlert = { isAlerting: false, startTime: null }; // Reset
                            } else {
                                console.log(`[LIGHT] Vẫn đang theo dõi... (${Math.round(elapsedTime / 1000)}s / 10s)`);
                            }
                        }
                    } else {
                        // Light <= 70, reset alert
                        if (lightAlert.isAlerting) {
                            console.log(`[LIGHT] Ánh sáng trở về bình thường (${latestValue}%). Reset alert.`);
                        }
                        lightAlert = { isAlerting: false, startTime: null };
                    }
                    continue; // Skip threshold check for light
                }
                
                // Xử lý temp, humi - check threshold
                const feedThreshold = thresholds.find(t => t.parameter_name.toLowerCase() === feedKey.toLowerCase());
                
                if (feedThreshold) {
                    const { lower_threshold, upper_threshold } = feedThreshold;
                    
                    if (latestValue < lower_threshold || latestValue > upper_threshold) {
                        const alertData = {
                            stationName: 'Trạm IoT (Hệ thống WaterQA)',
                            wqi: `VƯỢT NGƯỠNG (${latestValue})`,
                            message: `Cảnh báo: Chỉ số [${feedKey.toUpperCase()}] hiện tại là ${latestValue}, vượt ra khỏi giới hạn an toàn cho phép (từ ${lower_threshold} đến ${upper_threshold}). Vui lòng kiểm tra lại hệ thống! (Ghi nhận lúc: ${recordTime})`
                        };
                        await sendAlertToAllUsers(alertData);
                        console.log(`[CẢNH BÁO] Đã gửi mail cảnh báo cho feed: ${feedKey}`);
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi trong quá trình chạy hệ thống giám sát tự động:", error.message);
        }
    }, 5000); // 5000ms = 5 giây/lần → đủ để phát hiện chuỗi liên tục 10s (LIGHT_DURATION_MS)
};
module.exports = { startDeviceMonitor };
