const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database configuration
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

// Get all permissions
router.get('/', async (req, res) => {
  try {
    const [permissions] = await pool.query(`
      SELECT p.*,
        (SELECT GROUP_CONCAT(r.name SEPARATOR ', ') 
         FROM roles r 
         INNER JOIN role_permissions rp ON r.id = rp.role_id 
         WHERE rp.permission_id = p.id) as assigned_roles
      FROM permissions p
      ORDER BY p.module, p.name
    `);
    
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permissions',
      error: error.message
    });
  }
});

// Get permissions by module
router.get('/by-module', async (req, res) => {
  try {
    const [permissions] = await pool.query(`
      SELECT module, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', id,
            'name', name,
            'description', description,
            'status', status
          )
        ) as permissions
      FROM permissions
      GROUP BY module
      ORDER BY module
    `);
    
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Error fetching permissions by module:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permissions',
      error: error.message
    });
  }
});

// Get permission by ID
router.get('/:id', async (req, res) => {
  try {
    const [permissions] = await pool.query(
      'SELECT * FROM permissions WHERE id = ?',
      [req.params.id]
    );
    
    if (permissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    // Get roles with this permission
    const [roles] = await pool.query(`
      SELECT r.* FROM roles r
      INNER JOIN role_permissions rp ON r.id = rp.role_id
      WHERE rp.permission_id = ?
    `, [req.params.id]);
    
    res.json({
      success: true,
      data: {
        ...permissions[0],
        roles
      }
    });
  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching permission',
      error: error.message
    });
  }
});

// Create new permission
router.post('/', async (req, res) => {
  try {
    const { name, module, description, status } = req.body;
    
    // Validate required fields
    if (!name || !module) {
      return res.status(400).json({
        success: false,
        message: 'Permission name and module are required'
      });
    }

    // Insert permission
    const [result] = await pool.query(
      'INSERT INTO permissions (name, module, description, status) VALUES (?, ?, ?, ?)',
      [name, module, description || null, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: { 
        id: result.insertId, 
        name, 
        module, 
        description, 
        status 
      }
    });
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating permission',
      error: error.message
    });
  }
});

// Update permission
router.put('/:id', async (req, res) => {
  try {
    const { name, module, description, status } = req.body;
    const permissionId = req.params.id;

    await pool.query(
      'UPDATE permissions SET name = ?, module = ?, description = ?, status = ? WHERE id = ?',
      [name, module, description, status, permissionId]
    );

    res.json({
      success: true,
      message: 'Permission updated successfully',
      data: { id: permissionId, name, module, description, status }
    });
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating permission',
      error: error.message
    });
  }
});

// Delete permission
router.delete('/:id', async (req, res) => {
  try {
    const permissionId = req.params.id;

    // Delete permission (role_permissions will be deleted automatically due to CASCADE)
    await pool.query('DELETE FROM permissions WHERE id = ?', [permissionId]);

    res.json({
      success: true,
      message: 'Permission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting permission',
      error: error.message
    });
  }
});

// Toggle permission status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const permissionId = req.params.id;

    // Get current status
    const [permissions] = await pool.query(
      'SELECT status FROM permissions WHERE id = ?',
      [permissionId]
    );
    
    if (permissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    const newStatus = permissions[0].status === 'active' ? 'inactive' : 'active';

    // Update status
    await pool.query('UPDATE permissions SET status = ? WHERE id = ?', [newStatus, permissionId]);

    res.json({
      success: true,
      message: 'Permission status updated successfully',
      data: { status: newStatus }
    });
  } catch (error) {
    console.error('Error toggling permission status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling permission status',
      error: error.message
    });
  }
});

module.exports = router;
