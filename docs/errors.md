# Các lỗi chưa có cách giải quyết

## Backend

1. Khi đăng nhập lần đầu tiên sau khi app khởi động, app vẫn hoạt động bình thường (redirect tới trang /dashboard), nhưng console log cho thấy lỗi sau:
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (node:_http_outgoing:642:11)
    at ServerResponse.header (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/express/lib/response.js:686:10)
    at ServerResponse.send (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/express/lib/response.js:163:12)
    at showDashboardPage (/home/tdung/Code/DADN/WaterQA/src/backend/controllers/dashboard.controller.js:5:7)
    at Layer.handleRequest (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/router/lib/layer.js:152:17)
    at next (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/router/lib/route.js:157:13)
    at Route.dispatch (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/router/lib/route.js:117:3)
    at handle (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/router/index.js:435:11)
    at Layer.handleRequest (/home/tdung/Code/DADN/WaterQA/src/backend/node_modules/router/lib/layer.js:152:17)
    at /home/tdung/Code/DADN/WaterQA/src/backend/node_modules/router/index.js:295:15
```
- Tình trạng: chưa giải quyết
- Nguyên nhân: chưa xác định
- Hướng xử lý: chưa xác định
