/**
 * Adafruit IO Feed Configuration
 * 
 * Tùy chỉnh tên feeds để phù hợp với setup của bạn
 * 
 * Ví dụ:
 * - Nếu board gửi dữ liệu lên feed "temperature" thay vì "temp", 
 *   thay đổi TEMP_FEED thành "temperature"
 */

export const ADAFRUIT_FEEDS = {
  // Nhiệt độ (Celsius)
  TEMP_FEED: 'temp',
  
  // Độ ẩm (Percentage)
  HUMIDITY_FEED: 'humi',
  
  // Cảm biến ánh sáng (Light intensity - normal 60-70 khi mở nắp bồn)
  LIGHT_FEED: 'light',
} as const;

/**
 * Thresholds & Alerts Configuration
 */
export const THRESHOLDS = {
  TEMP_WARNING: 40,              // Cảnh báo nếu > 40°C
  HUMIDITY_WARNING: 80,          // Cảnh báo nếu > 80%
  LIGHT_NORMAL: 50,              // Ánh sáng bình thường: < 50
  LIGHT_WARNING: 60,             // Cảnh báo khi >= 60 (có người mở nắp bồn)
  LIGHT_CHECK_DURATION_MS: 5000, // Kiểm tra trong 5 giây
} as const;

/**
 * Refresh intervals
 */
export const REFRESH_INTERVALS = {
  DASHBOARD_REFRESH_MS: 8000,    // Refresh dashboard mỗi 8 giây
  ALERT_THROTTLE_MS: 30000,      // Không show alert quá 1 lần/30s
} as const;
