const { requireLogin } = require('../middleware/auth.middleware');

function showDashboardPage(req, res) {
  requireLogin(req, res, () => {});
  res.send(`
    <h1>WaterQA Dashboard</h1>
    ${req.session.user ? `<p>Welcome back, ${req.session.user.phone}!</p>` : ''}
    <p><a href="/auth/logout">Log out</a></p>
    <p><a href="/accounts/changePassword">Change password</a></p>
  `);
}
module.exports = {
  showDashboardPage,
};