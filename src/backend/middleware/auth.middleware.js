function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  next();
}
// function isAdmin(req, res, next) {
//   if (req.session.user?.role !== 'admin') {
//     return res.status(403).json({ error: 'Admin access required' });
//   }
//   next();
// }

module.exports = { requireLogin };