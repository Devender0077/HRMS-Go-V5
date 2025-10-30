const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const contractTemplateController = require('../controllers/contractTemplate.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Create uploads directory for contract templates
const templatesDir = path.join(__dirname, '../uploads/contract-templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
  console.log('✅ Created contract templates directory');
}

// Configure multer for template file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, templatesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'template-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for templates
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// CRUD routes
router.get('/', contractTemplateController.getAll);
router.get('/category/:category', contractTemplateController.getByCategory);
router.get('/region/:region', contractTemplateController.getByRegion);
router.get('/:id', contractTemplateController.getById);
router.post('/', upload.single('templateFile'), contractTemplateController.create);
router.put('/:id', upload.single('templateFile'), contractTemplateController.update);
router.delete('/:id', contractTemplateController.delete);

// Additional actions
router.post('/:id/toggle-active', contractTemplateController.toggleActive);
router.post('/:id/duplicate', contractTemplateController.duplicate);

module.exports = router;

