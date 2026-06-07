# WaterQA

Ứng dụng giám sát chất lượng nước theo thời gian thực, hỗ trợ đa nền tảng (iOS, Android, Web).

## Tính năng chính

- **Giám sát thời gian thực** — Lấy dữ liệu từ cảm biến IoT qua Adafruit IO mỗi 5 phút, lưu vào SQLite
- **Dashboard tổng quan** — Hiển thị 9 chỉ số chất lượng nước, dự đoán WQI bằng AI
- **Lịch sử quan trắc** — Biểu đồ đường 24h, drill-down 5 phút, xem theo ngày/tháng/năm
- **Cảnh báo** — Email tự động khi vượt ngưỡng, phát hiện mở nắp bồn chứa
- **Quản lý tài khoản** — Đăng ký, đăng nhập, quên mật khẩu OTP, Google OAuth

## Kiến trúc hệ thống

```
[Mobile — Expo Go / Web]
        │  HTTPS
        ▼
[Railway — Node.js/Express API]  ←→  [SQLite Database]
        │  REST API (mỗi 5 phút)
        ▼
[Adafruit IO — IoT Telemetry Data]
```

- **Frontend**: React Native + Expo Router + Redux Toolkit
- **Backend**: Node.js + Express + express-session
- **Database**: SQLite3 (better-sqlite3), timestamps lưu theo UTC
- **IoT Data**: Adafruit IO REST API (feeds: ph, hardness, solids, chloramines, sulfate, conductivity, organic-carbon, trihalomethanes, turbidity)
- **ML**: TensorFlow.js (dự đoán chất lượng nước WQI)
- **Email**: Brevo SMTP (OTP, cảnh báo ngưỡng)
- **Deploy**: Railway (backend auto-deploy từ GitHub `main`)

## Cấu trúc thư mục

```
/
├── src/
|   ├── frontend/     # React Native + Expo
|   ├── backend/      # Node.js + Express API
|   └── embedded/     # (IoT firmware placeholder)
├── data/             # SQLite database file
├── config/
├── build/
├── docs/
└── assets/
```

## Hướng dẫn chạy nhanh

Xem [SETUP.md](./SETUP.md) để biết chi tiết.

```bash
# Frontend
cd src/frontend
npm install
npx expo start -c
```

## Tài liệu API

Xem [docs/api.md](./docs/api.md) hoặc file `openapi-specification.json` (OpenAPI 3.0).

## Tiến độ tính năng

- [x] Auth (Login, Sign up, Đổi mật khẩu, Đăng xuất, Google OAuth)
- [x] Dashboard (Dữ liệu thời gian thực từ Adafruit IO)
- [x] Lịch sử quan trắc
  - [x] Fetch & lưu dữ liệu từ Adafruit IO vào DB (mỗi 5 phút)
  - [x] Biểu đồ 24h với trục X đầy đủ (giờ nào không có dữ liệu thì trống)
  - [x] Drill-down 5 phút khi click vào điểm trên biểu đồ
  - [x] Xem theo Ngày / Tháng / Năm
  - [x] Fix timezone UTC → local khi parse timestamp từ SQLite
- [x] Dự đoán WQI bằng AI (TensorFlow.js)
- [x] Xuất file CSV
- [x] Cảnh báo email (vượt ngưỡng, phát hiện mở nắp)
  - [x] CRUD ngưỡng cảnh báo
  - [x] Gửi email cảnh báo tự động
- [x] Quản lý sensor (danh sách, đổi tên)
- [x] Quản lý người dùng (Admin: xem danh sách; User: xem thông tin cá nhân)

## Lưu ý kỹ thuật

### Dữ liệu & múi giờ
- SQLite lưu `CURRENT_TIMESTAMP` theo **UTC**
- Frontend phải append `"Z"` khi parse chuỗi timestamp để đảm bảo JavaScript hiểu đúng múi giờ UTC (tránh lệch +7 giờ)
- Tất cả 4 trạm quan trắc hiển thị chung 1 bộ dữ liệu từ `station_id = 1` (dữ liệu thật từ Adafruit IO)

### Cron job backend
- Mỗi 5 giây: Kiểm tra ngưỡng cảnh báo (pH, độ cứng, ... )
- Mỗi 5 phút: Lấy toàn bộ 9 feeds từ Adafruit IO → lưu vào bảng `OBSERVATION` (station_id=1)
