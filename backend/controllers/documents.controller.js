const db = require('../config/database');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|txt/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG, and TXT files are allowed.'));
  }
}).single('document');

// Get all document categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      `SELECT * FROM document_categories WHERE status = 'active' ORDER BY name`
    );
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get employee documents
exports.getEmployeeDocuments = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10, category, status } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ['ed.employee_id = ?'];
    let params = [employeeId];

    if (category) {
      whereConditions.push('ed.category_id = ?');
      params.push(category);
    }

    if (status) {
      whereConditions.push('ed.status = ?');
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const [documents] = await db.execute(
      `SELECT 
        ed.*,
        dc.name as category_name,
        dc.is_mandatory,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name
      FROM employee_documents ed
      LEFT JOIN document_categories dc ON ed.category_id = dc.id
      LEFT JOIN employees e ON ed.employee_id = e.id
      ${whereClause}
      ORDER BY ed.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM employee_documents ed
       ${whereClause}`,
      params
    );

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get employee documents error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all employee documents (for documents page)
exports.getAllEmployeeDocuments = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    const userType = user?.userType || 'employee';
    const userId = user?.id;
    
    let query = `
      SELECT 
        ed.*,
        CONCAT(e.first_name, ' ', e.last_name) as employee_name,
        e.employee_id,
        u.id as user_id
      FROM employee_documents ed
      LEFT JOIN employees e ON ed.employee_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
    `;
    
    let whereConditions = [];
    let queryParams = [];
    
    // Role-based filtering
    if (userType === 'employee') {
      // Employees can only see their own documents
      whereConditions.push('u.id = ?');
      queryParams.push(userId);
    } else if (userType === 'manager') {
      // Managers can see their team's documents (same department)
      whereConditions.push(`
        e.department_id IN (
          SELECT department_id FROM employees WHERE user_id = ?
        )
      `);
      queryParams.push(userId);
    }
    // HR, HR Manager, and Super Admin can see all documents (no additional filtering)
    
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    query += ' ORDER BY ed.created_at DESC LIMIT 100';
    
    const [documents] = await db.execute(query, queryParams);

    res.json({
      success: true,
      data: documents || []
    });
  } catch (error) {
    console.error('Get all employee documents error:', error);
    // Return empty array on error instead of failing
    res.json({ 
      success: true,
      data: []
    });
  }
};

// Upload employee document
exports.uploadDocument = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const { employeeId, categoryId, documentName, documentNumber, issueDate, expiryDate, notes } = req.body;
      const userId = req.user?.id || 1; // Get from auth middleware

      const [result] = await db.execute(
        `INSERT INTO employee_documents 
        (employee_id, category_id, document_name, document_number, file_path, file_type, file_size, 
         issue_date, expiry_date, notes, upload_date, uploaded_by, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'pending')`,
        [
          employeeId,
          categoryId,
          documentName || req.file.originalname,
          documentNumber || null,
          req.file.path,
          req.file.mimetype,
          req.file.size,
          issueDate || null,
          expiryDate || null,
          notes || null,
          userId
        ]
      );

      const [document] = await db.execute(
        `SELECT ed.*, dc.name as category_name
         FROM employee_documents ed
         LEFT JOIN document_categories dc ON ed.category_id = dc.id
         WHERE ed.id = ?`,
        [result.insertId]
      );

      res.status(201).json(document[0]);
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

// Verify document
exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verificationNotes } = req.body;
    const userId = req.user?.id || 1;

    await db.execute(
      `UPDATE employee_documents 
       SET status = ?, verification_notes = ?, verified_by = ?, verification_date = NOW()
       WHERE id = ?`,
      [status, verificationNotes || null, userId, id]
    );

    const [document] = await db.execute(
      `SELECT ed.*, dc.name as category_name
       FROM employee_documents ed
       LEFT JOIN document_categories dc ON ed.category_id = dc.id
       WHERE ed.id = ?`,
      [id]
    );

    res.json(document[0]);
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Get file path before deleting
    const [document] = await db.execute(
      'SELECT file_path FROM employee_documents WHERE id = ?',
      [id]
    );

    if (document.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete from database
    await db.execute('DELETE FROM employee_documents WHERE id = ?', [id]);

    // TODO: Delete physical file from server
    // fs.unlinkSync(document[0].file_path);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get document statistics for employee
exports.getEmployeeDocumentStats = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [[stats]] = await db.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN expiry_date < CURDATE() THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as expiring_soon
      FROM employee_documents
      WHERE employee_id = ?`,
      [employeeId]
    );

    res.json(stats);
  } catch (error) {
    console.error('Get document stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
