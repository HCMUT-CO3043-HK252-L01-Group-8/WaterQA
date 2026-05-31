# WaterQA — Setup Guide

Hướng dẫn cài đặt và chạy ứng dụng **WaterQA** trên thiết bị di động (Expo Go).

> ✅ **Backend đã được deploy sẵn trên Railway** tại:  
> `https://waterqa-production.up.railway.app`  
> Bạn **KHÔNG cần chạy backend thủ công**. Chỉ cần cài và chạy frontend là xong.

---

## 🚀 Quick Start (Chạy trên điện thoại)

### Yêu cầu

- [Node.js](https://nodejs.org) v18+
- [Expo Go](https://expo.dev/client) đã cài trên điện thoại (iOS hoặc Android)
- Điện thoại và máy tính **cùng mạng Wi-Fi**

### Các bước

**Bước 1 — Clone repo về máy:**
```bash
git clone https://github.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA.git
cd WaterQA
```

**Bước 2 — Cài dependencies cho frontend:**
```bash
cd src/frontend
npm install
```

**Bước 3 — Chạy Expo:**
```bash
npx expo start -c
```

**Bước 4 — Quét QR code:**

- Mở app **Expo Go** trên điện thoại
- Quét mã QR hiển thị trên terminal

Ứng dụng sẽ tải lên và chạy thẳng trên điện thoại! 🎉

---

## 📁 Cấu Trúc Project

```
WaterQA/
├── src/
│   ├── backend/          # Node.js + Express API (đã deploy trên Railway)
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── services/
│   │   └── routes/
│   │
│   └── frontend/         # React Native + Expo (chạy local)
│       ├── .env          # ✅ Đã cấu hình sẵn URL backend Railway
│       ├── app/          # Màn hình ứng dụng
│       ├── components/   # UI components
│       ├── services/     # API client
│       └── store/        # Redux state management
│
├── openapi-specification.json  # API documentation
└── SETUP.md
```

---

## ⚙️ Biến Môi Trường (đã có sẵn)

File `src/frontend/.env` đã được cấu hình sẵn, **không cần thay đổi gì**:

```env
EXPO_PUBLIC_API_BASE_URL=https://waterqa-production.up.railway.app
EXPO_PUBLIC_GOOGLE_CLIENT_ID=...      # Web OAuth client
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...  # Android OAuth client
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...      # iOS OAuth client
```

---

## 🔑 Tài Khoản Mặc Định

| Email | Mật khẩu | Vai trò |
|---|---|---|
| `admin@waterqa.com` | `admin123` | Admin |

Hoặc bạn có thể **Đăng ký tài khoản mới** ngay trong app.

---

## 🌐 API Backend

Backend đã chạy live tại `https://waterqa-production.up.railway.app`.

Xem toàn bộ API endpoints trong file `openapi-specification.json` (OpenAPI 3.0).

Một số endpoint chính:

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/auth/register` | Đăng ký tài khoản |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/logout` | Đăng xuất |
| `GET` | `/auth/me` | Lấy thông tin cá nhân |
| `GET` | `/data/telemetry` | Lấy dữ liệu cảm biến |

---

## 🛠️ Chạy Backend Local (Không bắt buộc)

Nếu bạn muốn chạy backend trên máy của mình:

**Bước 1 — Cài dependencies:**
```bash
cd src/backend
npm install
```

**Bước 2 — Tạo file `.env` trong `src/backend/`:**
```env
SESSION_SECRET=your_session_secret
DATABASE_PATH=../../data/WaterQA.db
ADAFRUIT_IO_KEY=your_adafruit_key
ADAFRUIT_IO_USERNAME=your_adafruit_username
BREVO_API_KEY=your_brevo_api_key
```

**Bước 3 — Chạy server:**
```bash
node app.js
```

Backend sẽ chạy tại `http://localhost:3000`.

**Bước 4 — Cập nhật frontend để trỏ về localhost:**

Sửa `src/frontend/.env`:
```env
EXPO_PUBLIC_API_BASE_URL=http://<IP_MÁY_BẠN>:3000
```
> Lấy IP máy bằng lệnh `ipconfig` (Windows) — dùng địa chỉ IPv4.

---

## 🔧 Troubleshooting

### Expo không quét được QR / không kết nối được

- Đảm bảo điện thoại và máy tính **cùng mạng Wi-Fi**.
- Nếu dùng mạng trường/công ty có tường lửa, chạy lệnh sau để dùng tunnel:
  ```bash
  npx expo start -c --tunnel
  ```

### `npm install` bị lỗi

```bash
# Xoá cache và cài lại
cd src/frontend
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### App bị trắng / lỗi sau khi load

Nhấn `r` trong terminal để reload, hoặc lắc điện thoại → chọn **Reload**.

---

## 🧪 Kiến Trúc Hệ Thống

```
[Điện thoại — Expo Go]
        │  HTTPS
        ▼
[Railway — Backend API]  ←→  [SQLite Database]
        │
        ▼
[Adafruit IO — IoT Data]
```

- **Frontend**: React Native + Expo Router + Redux Toolkit
- **Backend**: Node.js + Express + express-session
- **Database**: SQLite3 (better-sqlite3)
- **IoT Data**: Adafruit IO REST API
- **ML**: TensorFlow.js (dự đoán chất lượng nước)
- **Email**: Brevo SMTP (OTP quên mật khẩu)
- **Deploy**: Railway (backend auto-deploy từ GitHub `main`)
