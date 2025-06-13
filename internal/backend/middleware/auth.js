const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = h.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = payload.id;
    next();
  });
};