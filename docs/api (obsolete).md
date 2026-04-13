# Danh sách API endpoint

Lưu ý: Doc này do dev @tdung vừa dev vừa viết nên Việt Anh lẫn lộn, rất mong quý anh chị em thông cảm. Khi chuẩn bị merge vào main sẽ thống nhất chuyển hết sang Việt (hoặc Anh).

## Đăng ký - đăng nhập

|#|Method|Endpoint|Description|Implemented?|
|:-:|:-:|-|-|:-:|
|1|GET|/|Same as /dashboard|<input type="checkbox" checked/>|
|2|GET|/accounts/all|Get all rows from User table in DB in JSON format|<input type="checkbox" checked/>|
|3|GET|/accounts/id/:id|Get 1 row by user_id (also UID) in JSON format|<input type="checkbox" checked/>|
|4|GET|/auth/login|Open login page|<input type="checkbox" checked/>|
|5|GET|/accounts/signup|Open sign up page|<input type="checkbox" checked/>|
|6|GET|/dashboard|Open dashboard page with information suitable for current session. If a session doesn't exist, redirect to /auth/login|<input type="checkbox" checked/>|
|7|GET|/accounts/change-password|Open change password page|<input type="checkbox" checked/>|
|8|POST|/auth/login|Login (actually create a session) and redirect to dashboard|<input type="checkbox" checked/>|
|9|POST|/accounts/signup|Create account, login and redirect to dashboard|<input type="checkbox" checked/>|
|10|POST|/accounts/changePassword|Change password|<input type="checkbox" checked/>|

## Theo dõi dữ liệu quan trắc

|#|Method|Endpoint|Description|Implemented?|
|:-:|:-:|-|-|:-:|
|1|GET|/data/live|View live monitoring data in real-time|<input type="checkbox"/>|
|2|GET|/data/history|View monitoring data history|<input type="checkbox"/>|

### Notes
- #1: Live monitoring data page should have a real-time line graph. Source of info is taken from IoT devices available to current user.
- #2: Data history shall be a list. There're 2 ways to implement. 1) the list contains only essential info, with a "view" button on every row allowing user to see details in a dialog box; 2) All info are shown on a row, no "view" button needed.
- #2: There's also an "export data" button which redirects to `/data/export`.

## Dự báo dữ liệu quan trắc

|#|Method|Endpoint|Description|Implemented?|
|:-:|:-:|-|-|:-:|
|1|GET|/data/forecast|Open data forecast page|<input type="checkbox"/>|
|2|POST|/data/forecast|Create data forecast using AI|<input type="checkbox"/>|

### Note
- #1: data forecast page includes: list of previous forecasts (each line has a "view" button to see details in a dialog box), "create forecast" button. "Create forecast" opens a form in dialog box/another page, user specifies: which fields to forecast, range of time, confidence level, then Enter.
- #2: calls AI service, then collect data, create a forecast, add it to DB, then redirect to #1.

## Xuất file

|#|Method|Endpoint|Description|Implemented?|
|:-:|:-:|-|-|:-:|
|1|GET|/data/export|Open export data page|<input type="checkbox"/>|
|2|POST|/data/export|Create data file in designated path|<input type="checkbox"/>|

### Note
- #1: Export data page has a form allowing user to specify: file type (raw JSON, svg or xlsx), directory path, and submit button. Currently only json and svg formats are supported.
- #2: App calls system file explorer (?)


## Nhập dữ liệu thủ công

I haven't imagined how this works yet.

## Quản lý thiết bị IoT

|#|Method|Endpoint|Description|Implemented?|
|:-:|:-:|-|-|:-:|
|1|GET|/devices/all|Show all IoT device as a table|<input type="checkbox"/>|
|2|GET|/devices/id/:id|Show detailed info of an IoT device, as well as config options|<input type="checkbox"/>|

### Notes
- #1: The tables only show essential info (including status), each row has a "show detail" button which redirects to #2.
- #2: The page includes: detailed info, an "enable/disable" button (?)

## Quản lý người dùng

I haven't imagined how this works yet.

# Ghi chú

Features to be implemented:

- <input type="checkbox" checked/> Change password.
- <input type="checkbox"/> Monitor data.
- <input type="checkbox"/> Forecast data.
- <input type="checkbox"/> Export file.
- <input type="checkbox"/> Manual input
- <input type="checkbox"/> Manage IoT devices
- <input type="checkbox"/> Manage users
- <input type="checkbox"/> Alert when IoT device has errors
- <input type="checkbox"/> Alert when threshold crossed
