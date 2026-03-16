function requireLogin(req, res, next) {
  if (!req.session.user) {
    // Option A: redirect for HTML apps
    return res.redirect('/auth/login');

    // Option B: JSON response for API
    // return res.status(401).json({ error: 'Please login' });
  }

  next();
}

function isAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { requireLogin };