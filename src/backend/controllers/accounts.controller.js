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
  const { name, email, phone_number, password, confirmPassword } = req.body;

  // Validate bắt buộc
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email và mật khẩu là bắt buộc', timestamp: new Date().toISOString() });
  }

  const { errCode, newId } = accountsService.addAccount(name, email, phone_number, password, confirmPassword);

  if (errCode > 0) {
    const errorMessages = {
      422: 'Mật khẩu xác nhận không khớp',
      409: 'Email hoặc số điện thoại đã được đăng ký',
      500: 'Lỗi máy chủ khi tạo tài khoản',
    };
    return res.status(errCode === 409 ? 409 : errCode === 422 ? 422 : 500).json({
      success: false,
      error: errorMessages[errCode] || 'Đăng ký thất bại',
      timestamp: new Date().toISOString(),
    });
  }

  // Lấy lại user vừa tạo để có đầy đủ thông tin
  const createdUsers = accountsService.findById(newId);
  const createdUser = createdUsers && createdUsers.length > 0 ? createdUsers[0] : null;

  req.session.user = {
    user_id: newId,
    email: email,
    name: (createdUser && createdUser.name) || name || email.split('@')[0],
    role: 'User',
  };

  return res.status(201).json({
    success: true,
    user: req.session.user,
    timestamp: new Date().toISOString(),
  });
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
