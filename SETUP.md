# Setup WaterQA Project

Hướng dẫn setup và chạy project WaterQA Dashboard với Adafruit IO integration.

## Prerequisites

- Node.js (v16+)
- npm hoặc yarn
- Adafruit IO account với data feeds

## Quick Start 

**Terminal 1 - Backend:**
```bash
cd src/backend
npm install
npm run dev
```

**Terminal 2 - Frontend (mở terminal mới):**
```bash
cd src/frontend
npm install
npm start
```

**Sau đó mở browser:**
```
http://localhost:8081/iot-dashboard
```

---

## Hướng dẫn Chi Tiết

### 1. Clone/Extract Project
```bash
cd WaterQA-demo
```

### 2. Configure Backend Environment

File `.env` đã được cấu hình sẵn với Adafruit IO credentials:
```env
ADAFRUIT_IO_KEY=aio_Qrvq88PkdBecDcy7o0VkfQPzwH5T
ADAFRUIT_IO_USERNAME=luonggminh05
```

**⚠️ Nếu bạn có Adafruit IO account khác, cập nhật file `src/backend/.env`:**
```env
ADAFRUIT_IO_KEY=your_adafruit_io_key
ADAFRUIT_IO_USERNAME=your_adafruit_io_username
```

### 3. Cài Đặt & Chạy Backend (Terminal 1)

```bash
# Vào thư mục backend
cd src/backend

# Cài đặt dependencies
npm install

# Chạy server với auto-reload
npm run dev
```

Backend sẽ chạy trên `http://localhost:3000` 

Khi thấy output sau đó là thành công:
```
App listening on port 3000
Predicted probability of potability: 90.82%
Classification: Potable (Safe)
```

### 4. Cài Đặt & Chạy Frontend - Expo Web (Terminal 2 - Mở Terminal Mới)

```bash
# Vào thư mục frontend
cd src/frontend

# Cài đặt dependencies
npm install

# Chạy Expo Web
npm start
```

Frontend sẽ khởi động tại `http://localhost:8081`

Khi thấy output sau đó là hoàn tất:
```
Expo Go: http://localhost:19000
Web: http://localhost:8081
```

### 5. Truy cập IoT Dashboard

Mở browser và vào:
```
http://localhost:8081/iot-dashboard
```

Dashboard sẽ hiển thị:
- 🌡️ **Temperature** - Nhiệt độ từ feed "temp"
- 💧 **Humidity** - Độ ẩm từ feed "humi"
- ⚠️ **Light Status** - Cảnh báo rò rỉ từ feed "leakage-signal"

Dữ liệu tự động refresh mỗi 8 giây từ Adafruit IO.

## Lưu Ý Quan Trọng

**Phải mở 2 terminal riêng biệt:**
- Terminal 1: Chạy Backend (src/backend)
- Terminal 2: Chạy Frontend (src/frontend)

**Backend PHẢI chạy trước Frontend**, nếu không frontend sẽ không thấy dữ liệu

**Nếu port 3000 hoặc 8081 bị chiếm**, xem phần Troubleshooting ở dưới

## Architecture

```
WaterQA-demo/
├── src/
│   ├── backend/          (Node.js Express API, port 3000)
│   │   ├── app.js        (✅ CORS enabled)
│   │   ├── .env          (Adafruit IO credentials)
│   │   ├── controllers/  (API logic)
│   │   ├── services/     (Business logic)
│   │   └── routes/       (API endpoints)
│   │
│   └── frontend/         (React Native + Expo, port 8081)
│       ├── .env.local    (✅ Backend URL configured)
│       ├── services/     (API client)
│       ├── app/          (Pages & screens)
│       └── components/   (UI components)
│
├── data/
│   └── WaterQA.db        (SQLite database)
│
└── docs/
    └── api.md            (API documentation)
```

## Troubleshooting

### Backend không khởi động (Error: "npm run dev" không tìm thấy script)

**Giải pháp:**
Sử dụng lệnh chính xác:
```bash
cd src/backend
npx nodemon app.js
```

Hoặc chạy trực tiếp Node.js:
```bash
node app.js
```

### Frontend không thấy dữ liệu (Error: "Failed to fetch data from the server")

**Nguyên nhân:** Backend không chạy hoặc CORS không được enable.

**Giải pháp:**
1. Kiểm tra backend đang chạy trên port 3000:
   ```bash
   curl http://localhost:3000/data/telemetry?feedKey=temp&rowLimit=1
   ```
2. Nếu không kết nối được, restart backend:
   ```bash
   # Terminal backend - Nhấn Ctrl+C để dừng, sau đó chạy lại
   npx nodemon app.js
   ```
3. Reload frontend (Ctrl+R hoặc F5)

### Adafruit IO không trả về dữ liệu

**Kiểm tra:**
1. Credentials đúng trong `.env` (Kiểm tra ADAFRUIT_IO_KEY và ADAFRUIT_IO_USERNAME)?
2. Các feeds "temp", "humi", "leakage-signal" tồn tại trong Adafruit IO?
3. Check logs trong backend terminal để xem có error gì không

### Port 3000 hoặc 8081 đã được sử dụng

**Giải pháp (Windows):**
```bash
# Tìm process sử dụng port 3000
netstat -ano | findstr :3000

# Kill process (thay <PID> bằng Process ID)
taskkill /PID <PID> /F

# Tương tự cho port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### npm install lỗi hoặc packages không cài đặt được

**Giải pháp:**
```bash
# Xóa node_modules và package-lock.json
rm -r node_modules package-lock.json

# Cài lại
npm install
```

### Tất cả đang chạy nhưng muốn dừng

```bash
# Trong mỗi terminal chạy backend/frontend
Ctrl + C
```

## Key Changes Made

**CORS Middleware** - Thêm vào `src/backend/app.js` (lines 20-28)
   - Cho phép frontend (port 8081) kết nối tới backend (port 3000)

**Frontend Environment Config** - Tạo `src/frontend/.env.local`
   - Cấu hình `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000`

**API Endpoint** - `/data/telemetry` 
   - Query params: `feedKey` (string) + `rowLimit` (number)
   - Kéo data từ Adafruit IO theo real-time

## API Endpoints

### Get Telemetry Data
```
GET /data/telemetry?feedKey=temp&rowLimit=1
```

Response:
```json
{
  "success": true,
  "payload": {
    "data": [
      {
        "value": "31.1",
        "created_at": "2026-05-05T04:50:09Z"
      }
    ],
    "count": 1
  },
  "timestamp": "2026-05-05T14:02:51.972Z"
}
```

## Development Notes

- Backend: Node.js + Express
- Frontend: React Native + Expo (cross-platform)
- Database: SQLite3 (better-sqlite3)
- ML Model: TensorFlow.js (for water potability prediction)
- Real-time Data: Adafruit IO REST API

## Next Steps

- [ ] Add authentication to API endpoints
- [ ] Implement threshold alerts
- [ ] Add data export feature
- [ ] Create admin dashboard
- [ ] Deploy to production
