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
  const { email, password } = req.body;

  const { err, user } = authService.login(email, password);

  // Check if this is an API call (from React Native/Web frontend)
  const isApiRequest = 
    req.headers['content-type']?.includes('application/json') ||
    req.headers['accept']?.includes('application/json');

  try {
    if (err > 0) {
      const errorMessages = {
        404: 'Email không tồn tại',
        422: 'Mật khẩu không đúng',
        500: 'Lỗi máy chủ'
      };
      const errorMessage = errorMessages[err] || 'Đăng nhập thất bại';

      if (isApiRequest) {
        return res.status(err === 404 ? 404 : err === 422 ? 401 : 500).json({ 
          success: false, 
          error: errorMessage 
        });
      }
      return res.redirect(`/auth/login?error=${err}`);
    }

    req.session.user = {
      user_id: user.user_id,
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: user.role,
      verification_status: user.verification_status
    }

    console.log('User logged in', user);
    
    if (isApiRequest) {
      return res.status(200).json({ 
        success: true, 
        user: req.session.user 
      });
    }
    return res.redirect("/dashboard");
  } catch (err) {
    console.error('Login error:', err);
    if (isApiRequest) {
      return res.status(500).json({ 
        success: false, 
        error: 'Lỗi máy chủ khi đăng nhập' 
      });
    }
    return res.redirect('/auth/login?error=500');
  }
}

function logout(req, res) {
  // REST API clients (React Native/Web frontend) send DELETE with Accept: application/json
  const isApiRequest =
    req.method === 'DELETE' ||
    (req.headers['accept'] && req.headers['accept'].includes('application/json'));

  if (!req.session.user) {
    if (isApiRequest) {
      return res.status(200).json({ success: true, message: 'Already logged out' });
    }
    return res.redirect('/auth/login');
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    if (isApiRequest) {
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } else {
      res.redirect("/auth/login");
    }
  });
}

function loginWithGoogle(req, res) {
  const { name, email, picture } = req.body;

  try {
    const { err, user } = authService.loginWithGoogle({ name, email, picture });
    
    if (err > 0) {
      const errorMessages = {
        500: 'Lỗi máy chủ khi xử lý Google login'
      };
      return res.status(500).json({ 
        success: false, 
        error: errorMessages[err] || 'Đăng nhập Google thất bại' 
      });
    }

    req.session.user = {
      user_id: user.user_id,
      name: name, // Use Google user's name
      email: user.email,
      role: user.role,
      verification_status: user.verification_status,
      picture: picture
    }

    console.log('Google user logged in:', user);
    
    return res.status(200).json({ 
      success: true, 
      user: req.session.user 
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Lỗi máy chủ khi đăng nhập' 
    });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập email' });
  }

  const result = await authService.forgotPassword(email);
  if (result.err === 404) {
    return res.status(404).json({ success: false, error: result.message });
  }
  if (result.err !== 0) {
    return res.status(500).json({ success: false, error: result.message });
  }
  return res.status(200).json({ success: true, message: 'Mã OTP đã được gửi vào email của bạn' });
}

function resetPassword(req, res) {
  const { email, otp, new_password } = req.body;
  if (!email || !otp || !new_password) {
    return res.status(400).json({ success: false, error: 'Thiếu thông tin. Cần email, otp và new_password' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
  }

  const result = authService.resetPassword(email, otp, new_password);
  if (result.err !== 0) {
    return res.status(400).json({ success: false, error: result.message });
  }
  return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });
}

// Xác thực OTP (bước trung gian trước khi đổi mật khẩu)
function verifyOTP(req, res) {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Thiếu thông tin. Cần email và otp' });
  }

  const result = authService.verifyOTP(email, otp);
  if (result.err !== 0) {
    return res.status(400).json({ success: false, error: result.message });
  }
  return res.status(200).json({ success: true, message: 'Mã OTP hợp lệ' });
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
  loginWithGoogle,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
  // createSession,
  getMySession,
};
