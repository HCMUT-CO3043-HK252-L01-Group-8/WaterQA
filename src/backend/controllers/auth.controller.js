// controllers/auth.controller.js
const authService = require('../services/auth.service');
const { view } = require('../utils/path');

function showLoginPage(req, res) {
  if (req.session.user) {
    return res.redirect("/dashboard"); // this condition can only be implemented at Controller layer
  }
  const err_ = req.query.error || 0;
  res.render('login', {
    err: err_
  });
}

async function login(req, res) {
  const { id, password } = req.body;

  const { err, user } = authService.login(id, password);
  // console.log("ERR:", err);
  // console.log("USER:", user);

  if (err > 0) {
    return res.redirect(`/auth/login?error=${err}`);
  }
  req.session.user = user;
  return res.redirect("/dashboard");

}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
}

module.exports = {
  showLoginPage,
  login,
  logout,
};
