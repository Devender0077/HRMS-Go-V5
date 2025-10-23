const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms_go_v5',
  // socketPath: process.env.DB_SOCKET || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
};

const pool = mysql.createPool(dbConfig);

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const [announcements] = await pool.query(`
      SELECT a.*, u.name as author_name, u.avatar as author_avatar
      FROM announcements a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `);
    
    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements',
      error: error.message
    });
  }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const [announcements] = await pool.query(`
      SELECT a.*, u.name as author_name, u.avatar as author_avatar
      FROM announcements a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (announcements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      data: announcements[0]
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching announcement',
      error: error.message
    });
  }
});

// Create announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, priority, target_audience, author_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO announcements (title, content, priority, target_audience, author_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, priority || 'normal', target_audience || 'all', author_id || 1]
    );

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { id: result.insertId, title, content }
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating announcement',
      error: error.message
    });
  }
});

// Update announcement
router.put('/:id', async (req, res) => {
  try {
    const { title, content, priority, target_audience, status } = req.body;
    
    await pool.query(
      'UPDATE announcements SET title = ?, content = ?, priority = ?, target_audience = ?, status = ? WHERE id = ?',
      [title, content, priority, target_audience, status, req.params.id]
    );

    res.json({
      success: true,
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating announcement',
      error: error.message
    });
  }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting announcement',
      error: error.message
    });
  }
});

module.exports = router;

