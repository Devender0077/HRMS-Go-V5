const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  // socketPath: process.env.DB_SOCKET || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
};

const pool = mysql.createPool(dbConfig);

// Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.id, u.name, u.email, u.phone, u.user_type, u.status, 
             u.avatar, u.created_at, u.last_login_at,
             r.name as role_name,
             r.id as role_id,
             d.name as department_name,
             e.employee_id
      FROM users u
      LEFT JOIN user_roles r ON u.role_id = r.id
      LEFT JOIN employees e ON u.id = e.user_id
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY u.created_at DESC
    `);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const user = { ...users[0] };
    delete user.password;
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, user_type, phone, status } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get role_id based on user_type
    const [roles] = await pool.query(
      'SELECT id FROM user_roles WHERE slug = ?',
      [user_type || 'employee']
    );
    const roleId = roles.length > 0 ? roles[0].id : null;

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, user_type, phone, status, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, user_type || 'employee', phone || null, status || 'active', roleId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: result.insertId, name, email, user_type, role_id: roleId }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Error creating user',
      error: error.message
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, user_type, phone, status, role_id } = req.body;
    
    // If user_type changed, update role_id too
    let finalRoleId = role_id;
    if (user_type && !role_id) {
      const [roles] = await pool.query(
        'SELECT id FROM user_roles WHERE slug = ?',
        [user_type]
      );
      finalRoleId = roles.length > 0 ? roles[0].id : null;
    }
    
    await pool.query(
      'UPDATE users SET name = ?, email = ?, user_type = ?, phone = ?, status = ?, role_id = ?, updated_at = NOW() WHERE id = ?',
      [name, email, user_type, phone, status, finalRoleId, req.params.id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { id: req.params.id, name, email, user_type, role_id: finalRoleId }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error.code === 'ER_DUP_ENTRY' ? 'Email already exists' : 'Error updating user',
      error: error.message
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent deleting super admin
    const [users] = await pool.query('SELECT user_type FROM users WHERE id = ?', [userId]);
    
    if (users.length > 0 && users[0].user_type === 'super_admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete super admin user'
      });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// Toggle user status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT status FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newStatus = users[0].status === 'active' ? 'inactive' : 'active';
    await pool.query('UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, req.params.id]);

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
});

// Reset password
router.post('/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, req.params.id]);

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: { userId: req.params.id }
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

// Login as user (impersonation)
router.post('/:id/login-as', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user details
    const [users] = await pool.query(
      `SELECT u.*, r.name as role_name, r.slug as role_slug 
       FROM users u 
       LEFT JOIN user_roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (users[0].status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Cannot login as inactive user'
      });
    }

    const user = users[0];
    delete user.password;

    // Get user's permissions
    let permissions = [];
    if (user.role_id) {
      const [rolePerms] = await pool.query(
        `SELECT p.slug 
         FROM role_permissions rp 
         JOIN permissions p ON rp.permission_id = p.id 
         WHERE rp.role_id = ?`,
        [user.role_id]
      );
      permissions = rolePerms.map(p => p.slug);
    }

    // Create token (reuse JWT logic from auth)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type,
        isImpersonating: true 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '4h' } // Shorter expiry for impersonation
    );

    res.json({
      success: true,
      message: 'Logged in as user',
      data: {
        user: {
          ...user,
          permissions,
          roleData: {
            id: user.role_id,
            name: user.role_name,
            slug: user.role_slug
          }
        },
        token,
        isImpersonating: true
      }
    });
  } catch (error) {
    console.error('Error logging in as user:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in as user',
      error: error.message
    });
  }
});

module.exports = router;

