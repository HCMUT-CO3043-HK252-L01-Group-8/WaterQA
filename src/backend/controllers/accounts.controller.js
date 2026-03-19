// controllers/accounts.controller.js
const accountsService = require("../services/accounts.service");

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
function checkByPhone(req, res) {
  try {
    const bool = accountsService.checkByPhone(req.params.phone);
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
  // Map error code with error logs
  let errLog = '';
  if (req.query.error == 1) { errLog = 'Password confirmation does not match'; }
  else if (req.query.error == 2) { errLog = 'Account existed. Please login'; }

  res.send(`
    <h1>Sign Up</h1>
    <form method="POST" action="/accounts/signup">
      <input name="phone" placeholder="Phone" required /><br>
      <input type="password" name="password" placeholder="Password" required /><br>
      <input type="password" name="passwordAgain" placeholder="Confirm password" required /><br>
      <button type="submit">Sign up</button>
    </form>
    <p style="color:red">${errLog}</p>
    Already have an account? <a href="/auth/login">Login</a>
  `);
}
function signup(req, res) {
  const { phone, password, passwordAgain } = req.body;
  const errCode = accountsService.addAccount(phone, password, passwordAgain);
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
  res.send(`
    <h1>Change password</h1>
    <form method="POST" action="/accounts/changePassword">
      <input type="password" name="currentPass" placeholder="Current password" required /><br>
      <input type="password" name="newPass" placeholder="New password" required /><br>
      <input type="password" name="confirmPass" placeholder="Confirm password" required /><br>
      <button type="submit">Change password</button>
    </form>
  `);
}

function changePassword(req, res) {
  const phone = req.session.user.phone;
  const { currentPass, newPass, confirmPass } = req.body;
  const errCode = accountsService.changePassword(phone, currentPass, newPass, confirmPass);
  if (errCode > 0) {
    res.redirect(`/accounts/changePassword?error=${errCode}`);
  }
  else {
    res.redirect("/dashboard");
  }
}

module.exports = {
  getAll,
  checkByPhone,
  showSignupPage,
  signup,
  showChangePasswordPage,
  changePassword
};
