const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
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

    // Get user from database
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

    // Attach user to request with all needed fields
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.user_type,
      roleId: user.role_id,
      status: user.status,
    };
    
    console.log('✅ Authenticated user:', req.user.email, '(Type:', req.user.userType, ')');
    next();
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Authentication failed',
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

