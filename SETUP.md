# WaterQA — Setup Guide

Hướng dẫn cài đặt và chạy ứng dụng **WaterQA** trên thiết bị di động (Expo Go).

>  **Backend đã được deploy sẵn trên Railway** tại:  
> `https://waterqa-production.up.railway.app`  
>**KHÔNG cần chạy backend thủ công**. 
---

## Chạy trên điện thoại

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

## Cấu Trúc Project

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
│       ├── .env          # Đã cấu hình sẵn URL backend Railway
│       ├── app/          # Màn hình ứng dụng
│       ├── components/   # UI components
│       ├── services/     # API client
│       └── store/        # Redux state management
│
├── openapi-specification.json  # API documentation
└── SETUP.md
```

---

## Biến Môi Trường (đã có sẵn)

File `src/frontend/.env` đã được cấu hình sẵn, **không cần thay đổi gì**:

```env
EXPO_PUBLIC_API_BASE_URL=https://waterqa-production.up.railway.app
EXPO_PUBLIC_GOOGLE_CLIENT_ID=...      # Web OAuth client
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...  # Android OAuth client
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...      # iOS OAuth client
```

---

##  Tài Khoản Mặc Định

| Email | Mật khẩu | Vai trò |
|---|---|---|
| `admin@waterqa.com` | `admin123` | Admin |

Hoặc bạn có thể **Đăng ký tài khoản mới** ngay trong app.

---

## API Backend

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

## Chạy Backend Local (Không bắt buộc)

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

# Chạy Unit Test Backend

Phần backend sử dụng **Jest** để kiểm thử đơn vị. Phạm vi kiểm thử hiện tại tập trung vào tầng service của backend, bao gồm:

```text
AuthService
DataService
DeviceService
```

Các thành phần phụ thuộc như database repository, email service và API Adafruit IO được mock để đảm bảo test chỉ tập trung vào logic xử lý của từng service.

---

## Di chuyển vào thư mục backend

Từ thư mục gốc của project:

```bash
cd src/backend
```

---

## Cài đặt dependencies

Nếu chưa cài dependencies:

```bash
npm install
```

---

## Chạy toàn bộ unit test

```bash
npm test
```

Kết quả mong đợi:

```text
Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
```

Điều này có nghĩa là tất cả test suites và test cases hiện tại đều chạy thành công.

---

## Chạy unit test kèm coverage

```bash
npm run test:coverage
```

Kết quả coverage hiện tại ở phạm vi service:

```text
All files
% Stmts   : 99.18
% Branch  : 100
% Funcs   : 95.23
% Lines   : 100
```

Ý nghĩa các cột coverage:

```text
% Stmts   : Tỷ lệ câu lệnh được test bao phủ
% Branch  : Tỷ lệ các nhánh điều kiện được test bao phủ
% Funcs   : Tỷ lệ hàm được test bao phủ
% Lines   : Tỷ lệ dòng code được test bao phủ
```

---

## Vị trí báo cáo coverage

Sau khi chạy:

```bash
npm run test:coverage
```

Jest sẽ sinh thư mục coverage tại:

```text
src/backend/coverage/
```

Có thể mở báo cáo HTML tại:

```text
src/backend/coverage/lcov-report/index.html
```

Trên Windows, có thể mở file này trực tiếp bằng trình duyệt.

---

## Chạy riêng từng file test

Chạy test cho AuthService:

```bash
npx jest tests/auth.service.test.js
```

Chạy test cho DataService:

```bash
npx jest tests/data.service.test.js
```

Chạy test cho DeviceService:

```bash
npx jest tests/device.service.test.js
```

---

## Vị trí các file unit test

Các file unit test backend nằm trong thư mục:

```text
src/backend/tests/
```

Danh sách file test hiện tại:

```text
src/backend/tests/auth.service.test.js
src/backend/tests/data.service.test.js
src/backend/tests/device.service.test.js
```

---

## Phạm vi kiểm thử

Bộ unit test hiện tại tập trung vào tầng service của backend.

Các service được kiểm thử:

```text
src/backend/services/auth.service.js
src/backend/services/data.service.js
src/backend/services/device.service.js
```

Các thành phần được mock trong quá trình test:

```text
repositories
database
mail service
Adafruit IO API
```

Lý do mock các thành phần này là để unit test chỉ kiểm tra logic xử lý nội bộ của service, không phụ thuộc vào database thật, API thật hoặc dịch vụ gửi email thật.

---

## Nội dung kiểm thử chính

### AuthService

Các test case chính:

```text
Đăng nhập với email không tồn tại
Đăng nhập sai mật khẩu
Đăng nhập thành công
Quên mật khẩu với email không tồn tại
Tạo OTP và gửi email
Xử lý trường hợp gửi email lỗi
Xác thực OTP không tồn tại
Xác thực OTP hết hạn
Xác thực OTP sai
Xác thực OTP đúng
Đặt lại mật khẩu thành công
Đặt lại mật khẩu khi database lỗi
Đăng nhập Google với user đã tồn tại
Đăng nhập Google và tạo user mới
Xử lý lỗi khi tạo user Google
```

### DataService

Các test case chính:

```text
Lấy lịch sử dữ liệu quan trắc
Lấy toàn bộ lịch sử dữ liệu không giới hạn
Lấy danh sách ngưỡng cảnh báo
Thêm ngưỡng cảnh báo thành công
Xử lý lỗi khi thêm ngưỡng cảnh báo
Chỉnh sửa ngưỡng cảnh báo
Xóa ngưỡng cảnh báo thành công
Xử lý lỗi khi xóa ngưỡng cảnh báo
Lấy telemetry data từ Adafruit IO thành công
Xử lý lỗi network khi gọi API ngoài
Xử lý lỗi HTTP khi gọi API ngoài
```

### DeviceService

Các test case chính:

```text
Lấy danh sách tất cả sensor
Lấy sensor theo id
Bật/tắt trạng thái sensor
Xử lý lỗi khi sensor không tồn tại
Thêm sensor với trạng thái mặc định
Thêm sensor với trạng thái được truyền vào
Xử lý lỗi khi thêm sensor thất bại
Đổi tên sensor thành công
Xử lý lỗi khi đổi tên sensor không tồn tại
```

---

## Ghi chú về coverage

Coverage hiện tại chỉ được thu thập trên các service chính:

```text
src/backend/services/auth.service.js
src/backend/services/data.service.js
src/backend/services/device.service.js
```

Không tính coverage cho các thư mục sau:

```text
repositories/
database/
services/mail.service.js
app.js
model/
```

Lý do là bộ test hiện tại được thiết kế theo hướng **kiểm thử đơn vị tầng service**. Các module repository, database, email service và API bên ngoài được xem là dependency và được mock.

Nếu muốn đánh giá toàn bộ backend, cần bổ sung thêm các loại kiểm thử khác như:

```text
Controller test
API integration test
Database integration test
End-to-end test
```

---

## Một số lỗi thường gặp khi chạy test

### Lỗi thiếu package

Nếu gặp lỗi dạng:

```text
Cannot find module
```

Hãy chạy lại:

```bash
npm install
```

## Quy trình chạy nhanh

Từ thư mục gốc project:

```bash
cd src/backend
npm install
npm test
npm run test:coverage
```

Nếu tất cả test pass và coverage được sinh thành công, quá trình kiểm thử backend hoàn tất.

---

## Troubleshooting

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

## Kiến Trúc Hệ Thống

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

# Huấn luyện model

## Yêu cầu dependency:

tfjs-node yêu cầu nodejs phiên bản 22 (lts) thể thực thi.

## Hướng dẫn

Bước 1: Di chuyển vào thư mục src/backend/model

Bước 2: Chạy lệnh `node trainer.js`

Sau khi hoàn tất, model sẽ được lưu vào thư mục data/

Để hệ thống deploy thấy được thay đổi mới, hãy commit và push.
