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
      SELECT u.id, u.name, u.email, u.phone, u.user_type as role, u.status, 
             u.avatar, u.created_at,
             d.name as department_name,
             (SELECT GROUP_CONCAT(r.name SEPARATOR ', ') 
              FROM roles r 
              INNER JOIN user_roles ur ON r.id = ur.role_id 
              WHERE ur.user_id = u.id) as roles
      FROM users u
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

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, user_type, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, user_type || 'employee', phone || null, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: result.insertId, name, email }
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
    const { name, email, user_type, phone, status } = req.body;
    
    await pool.query(
      'UPDATE users SET name = ?, email = ?, user_type = ?, phone = ?, status = ? WHERE id = ?',
      [name, email, user_type, phone, status, req.params.id]
    );

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
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
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, req.params.id]);

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
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);

    res.json({
      success: true,
      message: 'Password reset successfully'
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

module.exports = router;

