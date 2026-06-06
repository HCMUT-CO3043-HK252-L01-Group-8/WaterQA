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
const LIGHT_THRESHOLD = 60; // Mốc cảnh báo cường độ ánh sáng
const LIGHT_DURATION_MS = 10000; // 10 giây
const ALERT_COOLDOWN_MS = 15 * 60 * 1000; // 15 phút cooldown chung cho các loại cảnh báo
let lastAlertSentMap = { temp: 0, humi: 0, light: 0, hardware_error: 0 }; // Tracking cooldown cho từng feed

let lightAlert = { isAlerting: false, startTime: null }; // Tracking alert state


/**
 * Gửi cảnh báo tới tất cả users (hoặc admin nếu không có users)
 */
const sendAlertToAllUsers = async (alertData) => {
    // Kiem tra cong tac email. Neu bien nay = 'false' thi khong gui
    if (process.env.ENABLE_EMAIL_ALERTS === 'false') {
        console.log('[CẢNH BÁO] Đã bỏ qua gửi email vì ENABLE_EMAIL_ALERTS đang tắt.');
        return;
    }

    try {
        const allUsers = accountsRepo.findAll();

        if (allUsers && allUsers.length > 0) {
            // Chỉ gửi tới user có bật thông báo email
            for (let user of allUsers) {
                const notifEnabled = user.email_notifications === undefined ? 1 : user.email_notifications;
                if (user.email && notifEnabled) {
                    await mailService.sendAlertEmail(user.email, alertData);
                    console.log(`[CẢNH BÁO] Đã gửi mail tới user: ${user.email}`);
                } else if (user.email && !notifEnabled) {
                    console.log(`[CẢNH BÁO] Bỏ qua user ${user.email} (đã tắt email thông báo)`);
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
                    const now = Date.now();
                    if (now - lastAlertSentMap['hardware_error'] >= ALERT_COOLDOWN_MS) {
                        const errorData = {
                            stationName: 'Trạm IoT',
                            wqi: 'LỖI CẢM BIẾN / PHẦN CỨNG',
                            message: `Phát hiện dữ liệu bất thường từ cảm biến [${feedKey.toUpperCase()}]. Giá trị đo được là ${latestValue}. Có thể thiết bị đã bị hỏng hoặc chập mạch, vui lòng kiểm tra ngay lập tức! (Đo lúc: ${recordTime})`
                        };
                        await sendAlertToAllUsers(errorData);
                        console.log(`[CẢNH BÁO] Đã gửi mail lỗi phần cứng cho feed: ${feedKey}`);
                        lastAlertSentMap['hardware_error'] = now;
                    } else {
                        console.log(`[LỖI PHẦN CỨNG] Đang trong thời gian cooldown, bỏ qua gửi mail.`);
                    }
                    
                //Kiem tra vuot nguong chi khi khong co loi phan cung, neu co loi phan cung roi thi khong can check vuot nguong nua
                    continue; 
                }
                // Xử lý Light - cảnh báo mở nắp (light > LIGHT_THRESHOLD trong 10s)
                if (feedKey === 'light') {
                    if (latestValue > LIGHT_THRESHOLD) {
                        if (!lightAlert.isAlerting) {
                            // Bắt đầu tracking - chỉ bắt đầu đếm nếu chưa trong cooldown
                            const now = Date.now();
                            const inCooldown = (now - lastAlertSentMap.light < ALERT_COOLDOWN_MS);

                            if (inCooldown) {
                                const remainMin = Math.ceil((ALERT_COOLDOWN_MS - (now - lastAlertSentMap.light)) / 60000);
                                console.log(`[LIGHT] Phát hiện ánh sáng cao (${latestValue}%) nhưng đang trong cooldown. Còn ${remainMin} phút nữa mới gửi lại.`);
                            } else {
                                lightAlert.isAlerting = true;
                                lightAlert.startTime = now;
                                console.log(`[LIGHT] Phát hiện ánh sáng cao (${latestValue}%) lúc ${recordTime}. Theo dõi trong 10s...`);
                            }
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
                                console.log(`[CẢNH BÁO] Đã gửi mail cảnh báo MỞ NẮP - Light: ${latestValue}%. Cooldown ${ALERT_COOLDOWN_MS / 60000} phút.`);
                                // Reset tracking, lưu lại thời điểm gửi để cooldown
                                lastAlertSentMap.light = Date.now();
                                lightAlert = { isAlerting: false, startTime: null };
                            } else {
                                console.log(`[LIGHT] Vẫn đang theo dõi... (${Math.round(elapsedTime / 1000)}s / 10s)`);
                            }
                        }
                    } else {
                        // Light <= LIGHT_THRESHOLD, reset tracking (nhưng giữ lại lastAlertSentTime để cooldown)
                        if (lightAlert.isAlerting) {
                            console.log(`[LIGHT] Ánh sáng trở về bình thường (${latestValue}%). Reset tracking.`);
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
                        const now = Date.now();
                        if (now - lastAlertSentMap[feedKey] >= ALERT_COOLDOWN_MS) {
                            const alertData = {
                                stationName: 'Trạm IoT (Hệ thống WaterQA)',
                                wqi: `VƯỢT NGƯỠNG (${latestValue})`,
                                message: `Cảnh báo: Chỉ số [${feedKey.toUpperCase()}] hiện tại là ${latestValue}, vượt ra khỏi giới hạn an toàn cho phép (từ ${lower_threshold} đến ${upper_threshold}). Vui lòng kiểm tra lại hệ thống! (Ghi nhận lúc: ${recordTime})`
                            };
                            await sendAlertToAllUsers(alertData);
                            console.log(`[CẢNH BÁO] Đã gửi mail cảnh báo cho feed: ${feedKey}`);
                            lastAlertSentMap[feedKey] = now;
                        } else {
                            console.log(`[${feedKey.toUpperCase()}] Vượt ngưỡng nhưng đang cooldown, không gửi email.`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi trong quá trình chạy hệ thống giám sát tự động:", error.message);
        }
    }, 5000); // 5000ms = 5 giây/lần → đủ để phát hiện chuỗi liên tục 10s (LIGHT_DURATION_MS)

    // Cron job lưu dữ liệu lịch sử mỗi 5 phút
    cron.schedule('*/5 * * * *', async () => {
        try {
            console.log("Đang lấy dữ liệu từ Adafruit để lưu vào lịch sử...");
            let currentData = { temp: null, humi: null, light: null };

            for (let feedKey of FEEDS_TO_MONITOR) {
                const response = await dataService.getTelemetryData(feedKey, 1);
                if (response && response.data && response.data.length > 0) {
                    currentData[feedKey] = parseFloat(response.data[0].value);
                }
            }

            const stationId = 1; // Mặc định trạm 1
            dataService.insertObservation(
                stationId,
                currentData.light,  // light_intensity
                0,                  // water_level
                currentData.temp,   // temperature
                currentData.humi,   // humidity
                0,                  // tank_surface_moisture
                0,                  // lid_status
                0,                  // leakage_signal
                0,                  // intrusion_signal
                null,               // ph
                null,               // hardness
                null,               // solids
                null,               // chloramines
                null,               // sulfate
                null,               // conductivity
                null,               // organic_carbon
                null,               // trihalomethanes
                null                // turbidity
            );
            console.log("Đã lưu lịch sử quan trắc thành công.");
        } catch (error) {
            console.error("Lỗi khi lưu lịch sử quan trắc:", error.message);
        }
    });
};
module.exports = { startDeviceMonitor };
