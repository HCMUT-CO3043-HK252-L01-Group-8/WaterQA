const { requireLogin } = require('../middleware/auth.middleware');

function showDashboardPage(req, res) {
  requireLogin(req, res, () => {});
  // console.log('[Dashboard] User info:', req.session.user);
  res.send(`
    <h1>WaterQA Dashboard</h1>
    ${req.session.user ? `<p>Welcome back, ${req.session.user.phone}!</p>` : ''}
    <a href="/auth/logout">Log out</a>
  `);
}
module.exports = {
  showDashboardPage,
};