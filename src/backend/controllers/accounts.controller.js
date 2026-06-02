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

function getMe(req, res) {
  try {
    console.log('=== getMe Debug ===');
    console.log('Session:', req.session);
    console.log('Session User:', req.session?.user);
    console.log('Cookies:', req.headers.cookie);
    console.log('Origin:', req.headers.origin);
    
    if (!req.session || !req.session.user) {
      console.log('No session user found');
      return res.status(401).json({ success: false, error: 'Chưa đăng nhập', timestamp: new Date().toISOString() });
    }
    const userId = req.session.user.user_id;
    const users = accountsService.findById(userId);
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy user', timestamp: new Date().toISOString() });
    }
    const user = users[0];
    return res.status(200).json({
      success: true,
      payload: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        email_notifications: user.email_notifications !== undefined ? user.email_notifications : 1,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}

function updateEmailNotifications(req, res) {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, error: 'Chưa đăng nhập', timestamp: new Date().toISOString() });
    }
    const userId = req.session.user.user_id;
    const { email_notifications } = req.body;
    if (email_notifications === undefined) {
      return res.status(400).json({ success: false, error: 'Thiếu trường email_notifications', timestamp: new Date().toISOString() });
    }
    accountsService.updateEmailNotifications(userId, !!email_notifications);
    return res.status(200).json({
      success: true,
      message: email_notifications ? 'Bật thông báo email' : 'Tắt thông báo email',
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

async function requestDeleteOTP(req, res) {
  try {
    const email = req.session.user.email;
    const authService = require('../services/auth.service');
    const result = await authService.requestDeleteAccountOTP(email);
    if (result.err) {
      return res.status(result.err).json({ success: false, error: result.message, timestamp: new Date().toISOString() });
    }
    return res.status(200).json({ success: true, message: 'OTP sent', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}

function deleteAccount(req, res) {
  try {
    const email = req.session.user.email;
    const otp = req.body.otp || req.query.otp;
    if (!otp) {
      return res.status(400).json({ success: false, error: 'Thiếu mã OTP', timestamp: new Date().toISOString() });
    }
    
    const authService = require('../services/auth.service');
    const verifyResult = authService.verifyOTP(email, otp);
    if (verifyResult.err) {
      return res.status(verifyResult.err).json({ success: false, error: verifyResult.message, timestamp: new Date().toISOString() });
    }

    const id = req.session.user.user_id;
    accountsService.deleteAccount(id);
    req.session.destroy(() => {
      res.status(204).json({ success: true, timestamp: new Date().toISOString() });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}

function deleteAccountById(req, res) {
  try {
    const id = req.params.id;
    if (id == req.session.user.user_id) {
      return res.status(400).json({ success: false, error: 'Cannot delete yourself this way', timestamp: new Date().toISOString() });
    }
    accountsService.deleteAccount(id);
    res.status(200).json({ success: true, message: 'Account deleted successfully', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}

module.exports = {
  getAll,
  getMe,
  updateEmailNotifications,
  findById,
  showSignupPage,
  signup,
  showChangePasswordPage,
  changePassword,
  deleteAccount,
  deleteAccountById,
  requestDeleteOTP
};
