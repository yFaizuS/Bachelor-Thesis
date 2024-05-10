const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    // if (decoded.id != req.params.id) {
    //   return res.status(403).json({ error: 'Akses ditolak', halo: decoded.data.id, param: req.params.id});
    // }

    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;