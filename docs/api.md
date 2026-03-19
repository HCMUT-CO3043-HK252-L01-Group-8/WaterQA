# Danh sách API endpoint

Lưu ý: Doc này do dev @tdung vừa dev vừa viết nên Việt Anh lẫn lộn, rất mong quý anh chị em thông cảm. Khi chuẩn bị merge vào main sẽ thống nhất chuyển hết sang Việt (hoặc Anh).

## Đăng ký - đăng nhập

|Method|Endpoint|Description|
|---|---|---|
|GET|/|Same as /dashboard|
|GET|/accounts/all|Get all rows from Accounts table in DB in JSON format|
|GET|/accounts/id/:phone|Get 1 row by phone number (also UID) in JSON format|
|GET|/auth/login/|Open login page|
|GET|/accounts/signup/|Open sign up page|
|GET|/dashboard|Open dashboard page with information suitable for current session. If a session doesn't exist, redirect to /auth/login|
|GET|/accounts/changePassword|Open change password page|
|POST|/auth/login/|Login (actually create a session) and redirect to dashboard|
|POST|/accounts/signup|Create account, login and redirect to dashboard|
|POST|/accounts/changePassword|Change password|

## Theo dõi dữ liệu quan trắc

## Dự báo dữ liệu quan trắc

## Xuất file

## Nhập dữ liệu thủ công

## Quản lý thiết bị IoT

## Quản lý người dùng


# Ghi chú

Features to be implemented:

- [x] Change password. Should have 'confirm password'
- [ ] Monitor data. This will import Embedded modules
- [ ] Forecast data. This will import AI modules
- [ ] Export file. Only support svg
- [ ] Manual input
- [ ] Manage IoT devices (??)
- [ ] Manage users
- [ ] Alert when IoT device has errors
- [ ] Alert when threshold crossed
