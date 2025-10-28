const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
exports.authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 [Auth] Checking token for:', req.method, req.path);

    if (!token) {
      console.log('❌ [Auth] No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [Auth] Token decoded for user ID:', decoded.id);

    // Get user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('❌ [Auth] User not found in database:', decoded.id);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ [Auth] User found:', user.email, 'Status:', user.status);

    if (user.status !== 'active') {
      console.log('❌ [Auth] User account is inactive');
      return res.status(403).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Attach user to request with all needed fields
    // User model uses camelCase (userType) which maps to database user_type
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType || user.user_type, // Support both formats
      roleId: user.roleId || user.role_id, // Support both formats
      status: user.status,
    };
    
    console.log('✅ [Auth] Authenticated:', req.user.email, '(Type:', req.user.userType, 'Role:', req.user.roleId, ')');
    next();
  } catch (error) {
    console.error('❌ [Auth] Authentication error:', error.message);
    console.error('❌ [Auth] Error type:', error.name);
    
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

