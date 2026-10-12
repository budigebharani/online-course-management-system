const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isInMemoryMode } = require('../config/db');
const { store } = require('../config/inMemoryDb');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ocms_development_secret_key_change_in_production_2026'
      );

      let user;
      if (isInMemoryMode()) {
        const found = store.getUsers().find((u) => u._id.toString() === decoded.id.toString());
        if (found) {
          user = { ...found };
          delete user.password;
          user.id = user._id;
        }
      } else {
        user = await User.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth Middleware Token Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token was provided.',
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Administrator privileges are required.',
  });
};

module.exports = { protect, authorizeAdmin };
