const express = require('express');
const router = express.Router();
const documentEditorController = require('../controllers/documentEditor.controller');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/contract-templates/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'template-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and Word documents are allowed'));
  }
});

// Word document operations
router.post('/convert-word-to-pdf', auth.verifyToken, upload.single('file'), documentEditorController.convertWordToPdf);

// PDF editing operations
router.post('/add-watermark', auth.verifyToken, documentEditorController.addWatermark);
router.post('/compress', auth.verifyToken, documentEditorController.compressPdf);
router.post('/edit-metadata', auth.verifyToken, documentEditorController.editMetadata);

// PDF organization operations
router.post('/merge', auth.verifyToken, documentEditorController.mergePdfs);
router.post('/extract-pages', auth.verifyToken, documentEditorController.extractPages);
router.post('/rotate-pages', auth.verifyToken, documentEditorController.rotatePages);
router.post('/reorder-pages', auth.verifyToken, documentEditorController.reorderPages);
router.post('/delete-pages', auth.verifyToken, documentEditorController.deletePages);
router.post('/split', auth.verifyToken, documentEditorController.splitPdf);

// Signing operations
router.post('/add-text-annotation', auth.verifyToken, documentEditorController.addTextAnnotation);
router.post('/add-stamp', auth.verifyToken, documentEditorController.addStamp);

// PDF info
router.get('/info/:templateId', auth.verifyToken, documentEditorController.getPdfInfo);

module.exports = router;

