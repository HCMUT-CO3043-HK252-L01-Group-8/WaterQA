const express = require('express');

// const db = require('./database/db');          // ← our database connection
// require('./database/initDb');

const app = express();
const port = 3000;
const path = require('path');

// 'Tools' for URL parsing
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

// Mount routers
app.use('/accounts', accountsRouter);   // ← mount the router
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
// Special route: / = /dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Listen
app.listen(port, () => {
  console.clear();
  console.log(`App listening on port ${port}`);
});