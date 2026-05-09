function requireLogin(req, res, next) {
  if (!req.session.user) {
    // return res.redirect('/auth/login');
    return res.status(401).json({ error: 'Unauthorized', timestamp: new Date().toISOString() });
  }

  next();
}
function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized', timestamp: new Date().toISOString() });
  }
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { requireLogin };