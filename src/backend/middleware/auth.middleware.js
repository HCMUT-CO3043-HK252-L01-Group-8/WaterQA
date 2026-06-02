function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized', timestamp: new Date().toISOString() });
  }

  next();
}
function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized', timestamp: new Date().toISOString() });
  }
  if (req.session.user?.role?.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { requireLogin, requireAdmin };