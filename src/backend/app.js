const express = require('express');

const db = require('./database/db');          // ← our database connection
const { initSchema } = require('./database/initSchema');
initSchema(); // ← tạo tables nếu chưa có (an toàn, không xóa data)

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
require('dotenv').config(); // ← load .env file

const { predict } = require('./services/model.service');

// 'Tools' for URL parsing
app.use(express.urlencoded({ extended: true }));   // ← for form data (phone & password)
app.use(express.json());                           // ← optional but good to have for future API/JSON requests
app.set('view engine', 'ejs');                      // view engine
app.set('views', path.join(__dirname, 'views'));    // view path

// Enable CORS for frontend development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Allow localhost origins and specific domains
  const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3000',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:19006',
    'https://waterqa-production.up.railway.app',
  ];
  const isAllowed = !origin || allowedOrigins.includes(origin)
    || (origin && origin.endsWith('.trycloudflare.com'))
    || (origin && origin.endsWith('.vercel.app'))
    || (origin && origin.endsWith('.railway.app'));

  // ✅ FIX: Luôn cho phép credentials nếu origin là allowed hoặc không có origin (same-origin)
  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'false');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-AIO-Key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// Setup express-session (for auth)
const session = require('express-session');
app.set('trust proxy', 1); // Bắt buộc khi dùng secure cookie phía sau load balancer (như Railway)
app.use(session({
  secret: 'your-secret-key-change-this-2026',   // ← change this!
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // Railway HTTPS → cần secure+sameSite=none để cookie cross-origin hoạt động
    secure: !!process.env.RAILWAY_ENVIRONMENT_NAME || !!process.env.RAILWAY_PROJECT_ID || process.env.NODE_ENV === 'production',
    sameSite: (!!process.env.RAILWAY_ENVIRONMENT_NAME || !!process.env.RAILWAY_PROJECT_ID || process.env.NODE_ENV === 'production') ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
}));


// Import routers
const accountsRouter = require('./routes/accounts.route');
const authRouter = require('./routes/auth.route');
const dashboardRouter = require('./routes/dashboard.route');
const dataRouter = require('./routes/data.route');
const deviceRouter = require('./routes/device.route');
const modelRouter = require('./routes/model.route');

// Mount routers

const API_PREFIX = ''; //'/api/v1';
app.use(`${API_PREFIX}/accounts`, accountsRouter);   // ← mount the router
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/dashboard`, dashboardRouter);
app.use(`${API_PREFIX}/data`, dataRouter);
app.use(`${API_PREFIX}/devices`, deviceRouter);
app.use(`${API_PREFIX}/model`, modelRouter);
// Special route: / = /dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

if (process.env.NODE_ENV !== 'test') {
  const cronService = require('./services/cron.service');
  cronService.startDeviceMonitor();

  // Listen
  app.listen(port, async () => {
    console.clear();
    console.log(`App listening on port ${port}`);

    const rawSampleInput = {
      ph: 8.322986672402298,
      Hardness: 207.25246223156424,
      Solids: 28049.646283166327,
      Chloramines: 8.827061283189618,
      Sulfate: 297.81308453289193,
      Conductivity: 358.725868777638,
      Organic_carbon: 18.70927336873052,
      Trihalomethanes: 60.91142039439827,
      Turbidity: 4.052135727552661,
    };

    console.log(await predict(rawSampleInput))
  });
}

module.exports = app;
