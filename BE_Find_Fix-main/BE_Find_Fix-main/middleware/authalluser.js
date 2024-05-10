const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  jwt.verify(token, "rahasia", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    if (decoded.data.id != req.params.id) {
      return res.status(403).json({ error: 'Akses ditolak', halo: decoded.data.id, param: req.params.id});
    }

    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;