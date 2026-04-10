function showDashboardPage(req, res) {
  // requireLogin(req, res, () => { console.log('Login successfully'); });
  const phone = req.session.user?.phone_number || null;
  res.render('dashboard', { phone: phone });
}
module.exports = {
  showDashboardPage,
};