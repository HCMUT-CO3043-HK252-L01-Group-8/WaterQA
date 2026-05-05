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
      return res.redirect(`/auth/login?error=${errCode}`);
    }

    req.session.user = {
      user_id: user.user_id,
      role: user.role,
      verification_status: user.verification_status
    }

    console.log('User logged in', user);
    return res.redirect("/dashboard");
  } catch (err) {
    console.error('Login error:', err);
    return res.redirect('/auth/login?error=500');
  }

}

function logout(req, res) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  req.session.destroy(() => {
    res.redirect("/auth/login");
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
