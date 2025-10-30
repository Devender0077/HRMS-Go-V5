const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const contractController = require('../controllers/contract.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Create uploads directory for contracts
const contractsDir = path.join(__dirname, '../uploads/contracts');
if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir, { recursive: true });
}

// Configure multer for contract file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, contractsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'contract-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for contracts
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// CRUD routes
router.get('/', contractController.getAll);
router.get('/:id/download', contractController.download); // Must be before /:id to avoid conflicts
router.get('/:id', contractController.getById);
router.post('/', upload.single('contractFile'), contractController.create);
router.put('/:id', upload.single('contractFile'), contractController.update);
router.delete('/:id', contractController.delete);

module.exports = router;

