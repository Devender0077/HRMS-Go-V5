const documentEditorService = require('../services/documentEditorService');
const path = require('path');
const fs = require('fs').promises;

/**
 * Document Editor Controller
 * Handles PDF and Word document editing operations
 */

// Convert Word to PDF
exports.convertWordToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const wordFilePath = req.file.path;
    const outputFileName = `converted_${Date.now()}.pdf`;
    const outputPath = path.join(path.dirname(wordFilePath), outputFileName);

    const result = await documentEditorService.convertWordToPdf(wordFilePath, outputPath);

    if (result.success) {
      res.json({
        success: true,
        message: 'Document converted successfully',
        data: {
          fileName: outputFileName,
          filePath: `/uploads/contract-templates/${outputFileName}`,
        },
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error in convertWordToPdf:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add watermark
exports.addWatermark = async (req, res) => {
  try {
    const { templateId, watermarkText } = req.body;
    
    if (!templateId || !watermarkText) {
      return res.status(400).json({ success: false, message: 'Template ID and watermark text required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `watermarked_${Date.now()}.pdf`);

    const result = await documentEditorService.addWatermark(sourcePath, watermarkText, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in addWatermark:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Compress PDF
exports.compressPdf = async (req, res) => {
  try {
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ success: false, message: 'Template ID required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `compressed_${Date.now()}.pdf`);

    const result = await documentEditorService.compressPdf(sourcePath, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in compressPdf:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit metadata
exports.editMetadata = async (req, res) => {
  try {
    const { templateId, metadata } = req.body;

    if (!templateId) {
      return res.status(400).json({ success: false, message: 'Template ID required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `metadata_${Date.now()}.pdf`);

    const result = await documentEditorService.editMetadata(sourcePath, metadata, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in editMetadata:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Merge PDFs
exports.mergePdfs = async (req, res) => {
  try {
    const { templateIds } = req.body;

    if (!templateIds || !Array.isArray(templateIds) || templateIds.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 template IDs required' });
    }

    const pdfPaths = templateIds.map(id =>
      path.join(__dirname, '../uploads/contract-templates', `template-${id}.pdf`)
    );

    const outputPath = path.join(__dirname, '../uploads/contract-templates', `merged_${Date.now()}.pdf`);

    const result = await documentEditorService.mergePdfs(pdfPaths, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in mergePdfs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Extract pages
exports.extractPages = async (req, res) => {
  try {
    const { templateId, pageNumbers } = req.body;

    if (!templateId || !pageNumbers || !Array.isArray(pageNumbers)) {
      return res.status(400).json({ success: false, message: 'Template ID and page numbers required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `extracted_${Date.now()}.pdf`);

    const result = await documentEditorService.extractPages(sourcePath, pageNumbers, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in extractPages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rotate pages
exports.rotatePages = async (req, res) => {
  try {
    const { templateId, rotation, pageNumbers } = req.body;

    if (!templateId || !rotation) {
      return res.status(400).json({ success: false, message: 'Template ID and rotation required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `rotated_${Date.now()}.pdf`);

    const result = await documentEditorService.rotatePages(sourcePath, rotation, pageNumbers, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in rotatePages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder pages
exports.reorderPages = async (req, res) => {
  try {
    const { templateId, newOrder } = req.body;

    if (!templateId || !newOrder || !Array.isArray(newOrder)) {
      return res.status(400).json({ success: false, message: 'Template ID and new order required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `reordered_${Date.now()}.pdf`);

    const result = await documentEditorService.reorderPages(sourcePath, newOrder, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in reorderPages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete pages
exports.deletePages = async (req, res) => {
  try {
    const { templateId, pageNumbers } = req.body;

    if (!templateId || !pageNumbers || !Array.isArray(pageNumbers)) {
      return res.status(400).json({ success: false, message: 'Template ID and page numbers required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `deleted_pages_${Date.now()}.pdf`);

    const result = await documentEditorService.deletePages(sourcePath, pageNumbers, outputPath);

    res.json(result);
  } catch (error) {
    console.error('Error in deletePages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Split PDF
exports.splitPdf = async (req, res) => {
  try {
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ success: false, message: 'Template ID required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputDir = path.join(__dirname, '../uploads/contract-templates/split', `${Date.now()}`);

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    const result = await documentEditorService.splitPdf(sourcePath, outputDir);

    res.json(result);
  } catch (error) {
    console.error('Error in splitPdf:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add text annotation
exports.addTextAnnotation = async (req, res) => {
  try {
    const { templateId, text, x, y, pageNumber } = req.body;

    if (!templateId || !text) {
      return res.status(400).json({ success: false, message: 'Template ID and text required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `annotated_${Date.now()}.pdf`);

    const result = await documentEditorService.addTextAnnotation(
      sourcePath,
      text,
      x || 50,
      y || 700,
      pageNumber || 1,
      outputPath
    );

    res.json(result);
  } catch (error) {
    console.error('Error in addTextAnnotation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add stamp
exports.addStamp = async (req, res) => {
  try {
    const { templateId, stampText, x, y, pageNumber } = req.body;

    if (!templateId || !stampText) {
      return res.status(400).json({ success: false, message: 'Template ID and stamp text required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);
    const outputPath = path.join(__dirname, '../uploads/contract-templates', `stamped_${Date.now()}.pdf`);

    const result = await documentEditorService.addStamp(
      sourcePath,
      stampText,
      x || 400,
      y || 50,
      pageNumber || 1,
      outputPath
    );

    res.json(result);
  } catch (error) {
    console.error('Error in addStamp:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get PDF info
exports.getPdfInfo = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!templateId) {
      return res.status(400).json({ success: false, message: 'Template ID required' });
    }

    const sourcePath = path.join(__dirname, '../uploads/contract-templates', `template-${templateId}.pdf`);

    const result = await documentEditorService.getPdfInfo(sourcePath);

    res.json(result);
  } catch (error) {
    console.error('Error in getPdfInfo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

