// controllers/auth.controller.js
const authService = require('../services/auth.service');
// const { view } = require('../utils/path');

function showLoginPage(req, res) {
  if (req.session.user) {
    return res.redirect("/dashboard"); // this condition can only be implemented at Controller layer
  }
  const err_ = req.query.error || 0;
  res.render('login', {
    err: err_
  });
}

function login(req, res) {
  const { id, password } = req.body;

  const { errCode, user } = authService.login(id, password);

  try {
    if (errCode > 0) {
      // return res.redirect(`/auth/login?error=${err}`);
      res.status(errCode).json({ success: false, timestamp: new Date().toISOString() });
    }

    req.session.user = {
      user_id: user.user_id,
      role: user.role,
      verification_status: user.verification_status
    }

    console.log('User logged in', user);
    console.log('Session:', req.session);
    // return res.redirect("/dashboard");
    res.status(201).json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, timestamp: new Date().toISOString() });
  }

}

function logout(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, timestamp: new Date().toISOString() });
  }
  req.session.destroy(() => {
    // res.redirect("/auth/login");
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  });
}

// function createSession(req, user_id, role, verification_status) {

// }
function getMySession(req, res) {
  console.log('getMySession called');
  console.log('session:', req.session);
  if (!req.session.user) {
    return res.status(401).json({ success: false, timestamp: new Date().toISOString() });
  }
  res.status(200).json({ success: true, user: req.session.user, timestamp: new Date().toISOString() });
}

module.exports = {
  showLoginPage,
  login,
  logout,
  // createSession,
  getMySession,
};
