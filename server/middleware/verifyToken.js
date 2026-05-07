const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // First check cookie (works on desktop)
  let token = req.cookies.token;

  // If no cookie, check Authorization header (works on iPhone Safari)
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = { verifyToken };
