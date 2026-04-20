// controllers/accounts.controller.js
const accountsService = require("../services/accounts.service");

function getAll(req, res) {
  try {
    const accounts = accountsService.getAllAccounts();

    res.status(200).json({
      success: true,
      count: Array.isArray(accounts) ? accounts.length : 0,
      payload: Array.isArray(accounts) ? accounts : [],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}
function findById(req, res) {
  try {
    const bool = accountsService.findById(req.params.id);
    res.status(200).json({
      success: true,
      payload: bool,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}

function showSignupPage(req, res) {
  // console.log('Error shown:', req.query.error);
  res.render('sign-up', {error: req.query.error});
}

function signup(req, res) {
  const { mail, phone, password, confirmPassword } = req.body;
  const {errCode, newId} = accountsService.addAccount(mail, phone, password, confirmPassword);
  // console.log('errCode:', errCode);
  if (errCode > 0) {
    // res.redirect(`/accounts/signup?error=${errCode}`);
    res.status(errCode).json({ success: false, timestamp: new Date().toISOString()});
  }
  else {
    req.session.user = {
      user_id: newId,
      role: "User"
    }; // log in the user immediately after signing up. This can only be implemented at Controller layer because it involves creating session.
    // res.redirect("/dashboard");
    res.status(201).json({ success: true, timestamp: new Date().toISOString() });
  }
}


// obsoleted
function showChangePasswordPage(req, res) {
  // res.render('change-password', {err: req.query.error});
  res.status(200).json({ success: true, timestamp: new Date().toISOString() });
}

function changePassword(req, res) {
  const id = req.session.user.user_id;
  console.log("body:", req.body);
  // const { currentPassword, newPassword, confirmPassword } = req.body;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  // console.log(req.session.user);
  // console.log("Input info:", {id, currentPassword, newPassword, confirmPassword});
  try {
    const serviceResCode = accountsService.changePassword(id, currentPassword, newPassword, confirmPassword);
    if (serviceResCode > 0) {
      // res.redirect(`/accounts/change-password?error=${serviceResCode}`);
      res.status(serviceResCode).json({ success: false, timestamp: new Date().toISOString() });
    }
    else {
      // res.redirect("/dashboard");
      res.status(200).json({ success: true, timestamp: new Date().toISOString() });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
  
}

function deleteAccount(req, res) {
  try {
    const id = req.session.user.user_id;
    accountsService.deleteAccount(id);
    req.session.destroy(() => {
      res.status(204).json({ success: true, timestamp: new Date().toISOString() });
    }); // log out the user after deleting the account
    // res.status(204).json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
  
}

module.exports = {
  getAll,
  findById,
  showSignupPage,
  signup,
  showChangePasswordPage,
  changePassword,
  deleteAccount
};
