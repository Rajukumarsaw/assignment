const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const admin = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        console.log("decoded: ", decoded);
        const user = await User.findById(decoded.id).select('-password');
        console.log(user);
        if (user && user.role === 'admin') return next();
        res.status(403).json({ message: 'Admin access required' });
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { auth, admin };
