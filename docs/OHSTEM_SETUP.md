# Hướng Dẫn: Kết Nối Board mạch OhStem với WaterQA Dashboard

## 📋 Tổng Quan

Để kết nối board mạch OhStem gửi dữ liệu về WaterQA Dashboard thông qua Adafruit IO:

```
Board OhStem (ESP32/Arduino)
    ↓ (gửi dữ liệu qua WiFi)
Adafruit IO (Cloud storage)
    ↓
WaterQA Backend (http://localhost:3000)
    ↓
WaterQA Dashboard (http://localhost:8081)
```

---

## 🔑 Bước 1: Chuẩn Bị Adafruit IO Credentials

### Credentials Đã Cấu Hình:
```
Username: luonggminh05
API Key: aio_Qrvq88PkdBecDcy7o0VkfQPzwH5T
```

### Tạo Feed trên Adafruit IO:
1. Đăng nhập: https://io.adafruit.com
2. Vào **Feeds** → **Create Feed**
3. Tạo 3 feeds sau:
   - **temp** (nhiệt độ - Celsius)
   - **humi** (độ ẩm - %)
   - **leakage-signal** (cảnh báo rò rỉ - 0/1)

---

## 🛠️ Bước 2: Cấu Hình Board OhStem

### Code Ví Dụ cho ESP32 (Arduino IDE)

```cpp
#include <WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

// ========== WiFi Config ==========
#define WLAN_SSID       "your_wifi_ssid"
#define WLAN_PASS       "your_wifi_password"

// ========== Adafruit IO Config ==========
#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883
#define AIO_USERNAME    "luonggminh05"
#define AIO_KEY         "aio_Qrvq88PkdBecDcy7o0VkfQPzwH5T"

// ========== Initialize WiFi & MQTT ==========
WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

// ========== Create MQTT Feeds ==========
Adafruit_MQTT_Publish mqtt_temp = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/temp");
Adafruit_MQTT_Publish mqtt_humi = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/humi");
Adafruit_MQTT_Publish mqtt_leakage = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/leakage-signal");

void setup() {
  Serial.begin(115200);
  delay(10);

  // Connect to WiFi
  Serial.print("Connecting to: ");
  Serial.println(WLAN_SSID);
  WiFi.begin(WLAN_SSID, WLAN_PASS);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }
}

void loop() {
  // Ensure MQTT connection
  if (!mqtt.connected()) {
    if (!mqtt.connect()) {
      Serial.println("Failed to connect to MQTT");
      delay(5000);
      return;
    }
  }

  // ========== Read Sensor Data ==========
  float temperature = readTemperatureSensor();  // Your sensor code here
  float humidity = readHumiditySensor();        // Your sensor code here
  int leakage = readLeakageSensor();            // Your sensor code here (0 or 1)

  // ========== Publish to Adafruit IO ==========
  Serial.print("Publishing Temperature: ");
  Serial.println(temperature);
  if (!mqtt_temp.publish(temperature)) {
    Serial.println("Failed to publish temperature");
  }

  Serial.print("Publishing Humidity: ");
  Serial.println(humidity);
  if (!mqtt_humi.publish(humidity)) {
    Serial.println("Failed to publish humidity");
  }

  Serial.print("Publishing Leakage: ");
  Serial.println(leakage);
  if (!mqtt_leakage.publish(leakage)) {
    Serial.println("Failed to publish leakage");
  }

  // Delay giữa các lần gửi (tránh quá tải Adafruit IO)
  delay(10000); // 10 seconds
}

// ========== Sensor Reading Functions ==========
float readTemperatureSensor() {
  // TODO: Implement your temperature sensor reading logic
  // Example: DHT sensor, DS18B20, etc.
  return 25.5;  // Dummy value
}

float readHumiditySensor() {
  // TODO: Implement your humidity sensor reading logic
  return 65.4;  // Dummy value
}

int readLeakageSensor() {
  // TODO: Implement your leakage sensor reading logic
  // Return 0 = No leakage, 1 = Leakage detected
  return 0;  // Dummy value
}
```

### Library Requirements:
- **Adafruit MQTT Client**: https://github.com/adafruit/Adafruit_MQTT_Library
- **WiFi** (built-in cho ESP32)

---

## 🎯 Bước 3: Tùy Chỉnh Feed Names (Nếu Cần)

Nếu bạn đặt tên feeds khác, chỉnh sửa file:
**`src/frontend/config/feeds.ts`**

```typescript
export const ADAFRUIT_FEEDS = {
  TEMP_FEED: 'your_temperature_feed_name',        // Thay 'temp'
  HUMIDITY_FEED: 'your_humidity_feed_name',       // Thay 'humi'
  LEAKAGE_FEED: 'your_leakage_feed_name',         // Thay 'leakage-signal'
} as const;
```

Ví dụ nếu feeds của bạn là "sensor-temperature", "sensor-humidity", "sensor-leak":

```typescript
export const ADAFRUIT_FEEDS = {
  TEMP_FEED: 'sensor-temperature',
  HUMIDITY_FEED: 'sensor-humidity',
  LEAKAGE_FEED: 'sensor-leak',
} as const;
```

---

## 📊 Bước 4: Monitor Dashboard

Sau khi board gửi dữ liệu:

1. **Kiểm tra Adafruit IO**: https://io.adafruit.com → Feeds
   - Xem dữ liệu được lưu trữ trên cloud

2. **Kiểm tra Backend API**:
   ```bash
   curl "http://localhost:3000/data/telemetry?feedKey=temp&rowLimit=1"
   ```

3. **Kiểm tra Dashboard**:
   - Mở http://localhost:8081/iot-dashboard
   - Dữ liệu sẽ tự động refresh mỗi 8 giây

---

## ⚙️ Cấu Hình Thêm (Optional)

### Thay Đổi Refresh Interval
**`src/frontend/config/feeds.ts`**:
```typescript
export const REFRESH_INTERVALS = {
  DASHBOARD_REFRESH_MS: 5000,    // Thay 8s thành 5s
  ALERT_THROTTLE_MS: 30000,
} as const;
```

### Thay Đổi Warning Thresholds
**`src/frontend/config/feeds.ts`**:
```typescript
export const THRESHOLDS = {
  TEMP_WARNING: 35,              // Thay 40°C thành 35°C
  HUMIDITY_WARNING: 75,          // Thay 80% thành 75%
  LEAKAGE_DANGER: '1',
} as const;
```

---

## 🧪 Kiểm Tra & Troubleshooting

### ✅ Kiểm Tra Board Kết Nối WiFi
```cpp
Serial.print("WiFi Status: ");
Serial.println(WiFi.status()); // Phải = 3 (WL_CONNECTED)
```

### ✅ Kiểm Tra MQTT Connection
```cpp
if (mqtt.connected()) {
  Serial.println("MQTT Connected!");
} else {
  Serial.println("MQTT Not Connected");
}
```

### ❌ Dashboard không hiển thị dữ liệu

**Nguyên nhân có thể:**
1. Board chưa gửi dữ liệu → Check board console
2. Feed names không trùng khớp → Check `config/feeds.ts`
3. Adafruit IO API Key sai → Check `.env`
4. Backend không chạy → Check port 3000

**Giải pháp:**
```bash
# Terminal 1: Backend
cd src/backend && npm run dev

# Terminal 2: Frontend
cd src/frontend && npm start -- --web

# Terminal 3: Monitor board output
# (Check serial monitor của board)
```

---

## 📚 Tài Liệu Tham Khảo

- **Adafruit IO Docs**: https://learn.adafruit.com/adafruit-io/overview
- **Adafruit MQTT Client**: https://github.com/adafruit/Adafruit_MQTT_Library
- **OhStem Docs**: https://docs.ohstem.vn

---

## 🎉 Hoàn Thành!

Khi tất cả đã cấu hình xong:
- Board OhStem gửi data → Adafruit IO
- Dashboard tự động kéo data từ Adafruit IO
- Hiển thị real-time mỗi 8 giây
- Tự động cảnh báo nếu vượt ngưỡng
