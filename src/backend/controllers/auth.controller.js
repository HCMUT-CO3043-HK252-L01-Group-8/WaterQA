// controllers/auth.controller.js
const authService = require('../services/auth.service');

function showLoginPage(req, res) {
  if (req.session.user) {
    return res.redirect("/dashboard"); // this condition can only be implemented at Controller layer
  }
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/auth/login">
      <input name="phone" placeholder="Phone" required /><br>
      <input type="password" name="password" placeholder="Password" required /><br>
      <button type="submit">Login</button>
    </form>
    ${req.query.error ? '<p style="color:red">Wrong credentials</p>' : ""}
    Doesn't have an account? <a href="/accounts/signup">Sign up</a>
  `);
}

async function login(req, res) {
  const { phone, password } = req.body;
 
  const success = authService.login(phone, password);
  
  if (!success) {
    return res.redirect("/auth/login?error=1");
  }
  req.session.user = {
    phone: phone    // Don't store password!
  };
  res.redirect("/dashboard");

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
