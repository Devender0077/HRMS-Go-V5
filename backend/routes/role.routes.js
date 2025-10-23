const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database configuration - Use TCP connection for better compatibility
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  // socketPath: process.env.DB_SOCKET || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Get all roles
router.get('/', async (req, res) => {
  try {
    const [roles] = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM user_roles WHERE role_id = r.id) as users_count,
        (SELECT COUNT(*) FROM role_permissions WHERE role_id = r.id) as permissions_count
      FROM roles r
      ORDER BY r.created_at DESC
    `);
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
});

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const [roles] = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM user_roles WHERE role_id = r.id) as users_count,
        (SELECT COUNT(*) FROM role_permissions WHERE role_id = r.id) as permissions_count
      FROM roles r
      WHERE r.id = ?
    `, [req.params.id]);
    
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Get permissions for this role
    const [permissions] = await pool.query(`
      SELECT p.* FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [req.params.id]);
    
    res.json({
      success: true,
      data: {
        ...roles[0],
        permissions
      }
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: error.message
    });
  }
});

// Create new role
router.post('/', async (req, res) => {
  try {
    const { name, description, status, permissions } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Insert role
    const [result] = await pool.query(
      'INSERT INTO roles (name, slug, description, status, is_system, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, slug, description || null, status || 'active', 0]
    );

    const roleId = result.insertId;

    // Assign permissions if provided
    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      const permissionValues = permissions.map(permId => [roleId, permId]);
      await pool.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ?',
        [permissionValues]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { id: roleId, name, description, status }
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const { name, description, status, permissions } = req.body;
    const roleId = req.params.id;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Update role
    await pool.query(
      'UPDATE roles SET name = ?, slug = ?, description = ?, status = ? WHERE id = ?',
      [name, slug, description, status, roleId]
    );

    // Update permissions if provided
    if (permissions && Array.isArray(permissions)) {
      // Delete existing permissions
      await pool.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);
      
      // Insert new permissions
      if (permissions.length > 0) {
        const permissionValues = permissions.map(permId => [roleId, permId]);
        await pool.query(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES ?',
          [permissionValues]
        );
      }
    }

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: { id: roleId, name, description, status }
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const roleId = req.params.id;

    // Check if role is assigned to users
    const [users] = await pool.query(
      'SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?',
      [roleId]
    );

    if (users[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. It is assigned to ${users[0].count} user(s)`
      });
    }

    // Delete role (permissions will be deleted automatically due to CASCADE)
    await pool.query('DELETE FROM roles WHERE id = ?', [roleId]);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
});

// Toggle role status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const roleId = req.params.id;

    // Get current status
    const [roles] = await pool.query('SELECT status FROM roles WHERE id = ?', [roleId]);
    
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const newStatus = roles[0].status === 'active' ? 'inactive' : 'active';

    // Update status
    await pool.query('UPDATE roles SET status = ? WHERE id = ?', [newStatus, roleId]);

    res.json({
      success: true,
      message: 'Role status updated successfully',
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('Error toggling role status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling role status',
      error: error.message
    });
  }
});

module.exports = router;
