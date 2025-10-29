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
    console.log('👥 [Users API] Fetching all users');
    
    // First, check which columns exist in users table
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
    `);
    
    const existingColumns = columns.map(c => c.COLUMN_NAME);
    console.log('📋 [Users API] Existing columns in users table:', existingColumns);
    
    // Build SELECT query dynamically based on existing columns
    const selectFields = ['u.id', 'u.name', 'u.email', 'u.user_type', 'u.status', 'u.created_at'];
    
    if (existingColumns.includes('phone')) selectFields.push('u.phone');
    else selectFields.push('NULL as phone');
    
    if (existingColumns.includes('avatar')) selectFields.push('u.avatar');
    else selectFields.push('NULL as avatar');
    
    if (existingColumns.includes('last_login')) selectFields.push('u.last_login');
    else selectFields.push('NULL as last_login');
    
    selectFields.push('r.name as role_name', 'r.id as role_id', 'd.name as department_name', 'e.employee_id');
    
    const query = `
      SELECT ${selectFields.join(', ')}
      FROM users u
      LEFT JOIN user_roles r ON u.role_id = r.id
      LEFT JOIN employees e ON u.id = e.user_id
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY u.created_at DESC
    `;
    
    console.log('📝 [Users API] Executing query with dynamic columns');
    
    const [users] = await pool.query(query);
    
    console.log(`✅ [Users API] Fetched ${users.length} users`);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ [Users API] Error fetching users:', error);
    console.error('❌ [Users API] SQL Error details:', error.sqlMessage || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
      sqlMessage: error.sqlMessage
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
    const { name, email, password, user_type, phone, status, role_id } = req.body;
    
    console.log('➕ [Users API] Creating user:', { name, email, user_type, role_id, status });
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get role_id based on user_type or use provided role_id
    let finalRoleId = role_id;
    if (!finalRoleId && user_type) {
      const slug = user_type.replace('_', '-'); // Convert super_admin to super-admin
      const [roles] = await pool.query(
        'SELECT id FROM user_roles WHERE slug = ?',
        [slug]
      );
      finalRoleId = roles.length > 0 ? roles[0].id : null;
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, user_type, phone, status, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, user_type || 'employee', phone || null, status || 'active', finalRoleId]
    );

    console.log('✅ [Users API] User created successfully with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: result.insertId, name, email, user_type, role_id: finalRoleId }
    });
  } catch (error) {
    console.error('❌ [Users API] Error creating user:', error);
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
    const { name, email, user_type, phone, status, role_id, password } = req.body;
    
    console.log('📝 [Users API] Updating user ID:', req.params.id, 'with data:', { name, email, user_type, role_id, status });
    
    // If user_type changed, update role_id too
    let finalRoleId = role_id;
    if (user_type && !role_id) {
      const slug = user_type.replace('_', '-'); // Convert super_admin to super-admin
      const [roles] = await pool.query(
        'SELECT id FROM user_roles WHERE slug = ?',
        [slug]
      );
      finalRoleId = roles.length > 0 ? roles[0].id : null;
    }
    
    // If password is provided, hash it
    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET name = ?, email = ?, user_type = ?, phone = ?, status = ?, role_id = ?, password = ?, updated_at = NOW() WHERE id = ?',
        [name, email, user_type, phone, status, finalRoleId, hashedPassword, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, user_type = ?, phone = ?, status = ?, role_id = ?, updated_at = NOW() WHERE id = ?',
        [name, email, user_type, phone, status, finalRoleId, req.params.id]
      );
    }

    console.log('✅ [Users API] User updated successfully:', req.params.id);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { id: req.params.id, name, email, user_type, role_id: finalRoleId }
    });
  } catch (error) {
    console.error('❌ [Users API] Error updating user:', error);
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

    console.log('🗑️ [Users API] Attempting to delete user ID:', userId);

    // Prevent deleting super admin
    const [users] = await pool.query('SELECT user_type FROM users WHERE id = ?', [userId]);
    
    if (users.length > 0 && users[0].user_type === 'super_admin') {
      console.log('❌ [Users API] Cannot delete super admin');
      return res.status(400).json({
        success: false,
        message: 'Cannot delete super admin user'
      });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    console.log('✅ [Users API] User deleted successfully:', userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ [Users API] Error deleting user:', error);
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
    console.log('🔄 [Users API] Toggling status for user ID:', req.params.id);
    
    const [users] = await pool.query('SELECT status FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newStatus = users[0].status === 'active' ? 'inactive' : 'active';
    await pool.query('UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, req.params.id]);

    console.log('✅ [Users API] User status toggled:', req.params.id, '→', newStatus);

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('❌ [Users API] Error toggling user status:', error);
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
    
    console.log('🔐 [Users API] Resetting password for user ID:', req.params.id);
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashedPassword, req.params.id]);

    console.log('✅ [Users API] Password reset successfully for user:', req.params.id);

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: { userId: req.params.id }
    });
  } catch (error) {
    console.error('❌ [Users API] Error resetting password:', error);
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
    
    console.log('🔑 [Users API] Login as user ID:', userId);
    
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
        roleId: user.role_id,
        isImpersonating: true 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '4h' } // Shorter expiry for impersonation
    );

    console.log('✅ [Users API] Login as user successful:', userId, 'Name:', user.name);

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
    console.error('❌ [Users API] Error logging in as user:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in as user',
      error: error.message
    });
  }
});

// Change user role
router.patch('/:id/change-role', async (req, res) => {
  try {
    const { role_id } = req.body;
    
    console.log('👤 [Users API] Changing role for user ID:', req.params.id, 'to role ID:', role_id);
    
    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: 'Role ID is required'
      });
    }

    // Get role info to update user_type accordingly
    const [roles] = await pool.query('SELECT name, slug FROM user_roles WHERE id = ?', [role_id]);
    
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const roleSlug = roles[0].slug.replace('-', '_'); // Convert super-admin to super_admin
    
    await pool.query(
      'UPDATE users SET role_id = ?, user_type = ?, updated_at = NOW() WHERE id = ?',
      [role_id, roleSlug, req.params.id]
    );

    console.log('✅ [Users API] Role changed successfully for user:', req.params.id, 'New role:', roles[0].name);

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { role_id, role_name: roles[0].name }
    });
  } catch (error) {
    console.error('❌ [Users API] Error changing user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing user role',
      error: error.message
    });
  }
});

module.exports = router;

