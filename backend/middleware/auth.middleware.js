const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    // TEMPORARILY BYPASS AUTH FOR DEVELOPMENT
    const bypassAuth = process.env.BYPASS_AUTH === 'true' || process.env.NODE_ENV === 'development';
    if (bypassAuth) {
      console.log('⚠️  Auth bypassed for development');
      return next();
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

// Alias for authenticateToken (for backwards compatibility)
exports.verifyToken = exports.authenticateToken;

// Check permission
exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // Super admin has all permissions
      if (user.userType === 'super_admin') {
        return next();
      }

      // TODO: Implement proper permission checking
      // For now, allow all authenticated users
      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Permission denied',
      });
    }
  };
};

