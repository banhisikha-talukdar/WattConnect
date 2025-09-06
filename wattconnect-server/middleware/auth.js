const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT payload:", decoded);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    res.status(400).json({ error: 'Invalid token' });
  }
};