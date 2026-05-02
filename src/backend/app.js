const express = require('express');
const cors = require('cors');
// const db = require('./database/db');          // ← our database connection
// require('./database/initDb');

const app = express();
const port = 3000;
const path = require('path');
require('dotenv').config(); // ← load .env file

const { predict } = require('./services/model.service');

// 'Tools' for URL parsing
app.use(cors());
app.use(express.urlencoded({ extended: true }));   // ← for form data (phone & password)
app.use(express.json());                           // ← optional but good to have for future API/JSON requests
app.set('view engine', 'ejs');                      // view engine
app.set('views', path.join(__dirname, 'views'));    // view path


// Setup express-session (for auth)
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key-change-this-2026',   // ← change this!
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,          // prevents JS access → good security
    secure: false,           // ← set to true when you use HTTPS later
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (or shorter)
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
app.use
// Special route: / = /dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

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

  await predict(rawSampleInput)
});
