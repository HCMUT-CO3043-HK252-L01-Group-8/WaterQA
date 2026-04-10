// controllers/accounts.controller.js
const accountsService = require("../services/accounts.service");
// const { view } = require("../utils/path");

function getAll(req, res) {
  try {
    const accounts = accountsService.getAllAccounts();

    res.json({
      success: true,
      count: Array.isArray(accounts) ? accounts.length : 0,
      data: Array.isArray(accounts) ? accounts : [],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
function findById(req, res) {
  try {
    const bool = accountsService.findById(req.params.phone);
    res.json({
      success: true,
      data: bool,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function showSignupPage(req, res) {
  // console.log('Error shown:', req.query.error);
  res.render('sign-up', {error: req.query.error});
}
function signup(req, res) {
  const { mail, phone, password, passwordAgain } = req.body;
  const errCode = accountsService.addAccount(mail, phone, password, passwordAgain);
  // console.log('errCode:', errCode);
  if (errCode > 0) {
    res.redirect(`/accounts/signup?error=${errCode}`);
  }
  else {
    req.session.user = {
      phone: phone    // Don't store password!
    };
    res.redirect("/dashboard");
  }
}

function showChangePasswordPage(req, res) {
  res.render('change-password', {err: req.query.error});
}

function changePassword(req, res) {
  const id = req.session.user.user_id;
  const { currentPass, newPass, confirmPass } = req.body;
  // console.log(req.session.user);
  // console.log("Input info:", {id, currentPass, newPass, confirmPass});
  const errCode = accountsService.changePassword(id, currentPass, newPass, confirmPass);
  if (errCode > 0) {
    res.redirect(`/accounts/change-password?error=${errCode}`);
  }
  else {
    res.redirect("/dashboard");
  }
}

module.exports = {
  getAll,
  findById,
  showSignupPage,
  signup,
  showChangePasswordPage,
  changePassword
};
