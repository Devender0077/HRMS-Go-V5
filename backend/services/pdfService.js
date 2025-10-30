const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

/**
 * PDF Processing Service
 * Handles PDF manipulation, field detection, and form generation
 */

class PDFService {
  /**
   * Load PDF from file path
   */
  async loadPDF(filePath) {
    try {
      const fullPath = path.join(__dirname, '..', filePath);
      const existingPdfBytes = await fs.readFile(fullPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      return pdfDoc;
    } catch (error) {
      console.error('❌ Error loading PDF:', error);
      throw new Error(`Failed to load PDF: ${error.message}`);
    }
  }

  /**
   * Get PDF metadata
   */
  async getPDFMetadata(filePath) {
    try {
      const pdfDoc = await this.loadPDF(filePath);
      const pages = pdfDoc.getPages();
      
      return {
        pageCount: pages.length,
        pages: pages.map((page, index) => ({
          number: index + 1,
          width: page.getWidth(),
          height: page.getHeight(),
        })),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
      };
    } catch (error) {
      console.error('❌ Error getting PDF metadata:', error);
      throw error;
    }
  }

  /**
   * Add fillable fields to PDF
   */
  async addFieldsToPDF(filePath, fields, outputPath) {
    try {
      const pdfDoc = await this.loadPDF(filePath);
      const pages = pdfDoc.getPages();

      for (const field of fields) {
        const page = pages[field.pageNumber - 1];
        if (!page) continue;

        const { width, height } = page.getSize();

        // Draw field outline (for visualization during testing)
        page.drawRectangle({
          x: field.xPosition,
          y: height - field.yPosition - field.height, // PDF coords are bottom-up
          width: field.width,
          height: field.height,
          borderColor: rgb(0, 0, 1),
          borderWidth: 1,
        });

        // Add field label if provided
        if (field.fieldLabel) {
          page.drawText(field.fieldLabel, {
            x: field.xPosition,
            y: height - field.yPosition + 5,
            size: 8,
            color: rgb(0, 0, 0),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const fullOutputPath = path.join(__dirname, '..', outputPath);
      await fs.writeFile(fullOutputPath, pdfBytes);

      return {
        success: true,
        outputPath,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      console.error('❌ Error adding fields to PDF:', error);
      throw error;
    }
  }

  /**
   * Fill PDF form with field values
   */
  async fillPDFForm(filePath, fieldValues, outputPath) {
    try {
      const pdfDoc = await this.loadPDF(filePath);
      const pages = pdfDoc.getPages();

      for (const fieldValue of fieldValues) {
        const page = pages[fieldValue.pageNumber - 1];
        if (!page) continue;

        const { width, height } = page.getSize();

        // Draw filled value
        if (fieldValue.type === 'text' || fieldValue.type === 'date') {
          page.drawText(fieldValue.value || '', {
            x: fieldValue.xPosition + 5,
            y: height - fieldValue.yPosition - fieldValue.height / 2,
            size: 10,
            color: rgb(0, 0, 0),
          });
        }

        // For signatures, we'll embed the image later (Phase 3)
      }

      const pdfBytes = await pdfDoc.save();
      const fullOutputPath = path.join(__dirname, '..', outputPath);
      await fs.writeFile(fullOutputPath, pdfBytes);

      return {
        success: true,
        outputPath,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      console.error('❌ Error filling PDF form:', error);
      throw error;
    }
  }

  /**
   * Merge signature image into PDF
   */
  async embedSignature(filePath, signatureData, field, outputPath) {
    try {
      const pdfDoc = await this.loadPDF(filePath);
      const pages = pdfDoc.getPages();
      const page = pages[field.pageNumber - 1];

      if (!page) {
        throw new Error(`Page ${field.pageNumber} not found`);
      }

      // Convert base64 signature to image
      const signatureImageBytes = Buffer.from(signatureData.split(',')[1], 'base64');
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

      const { width, height } = page.getSize();

      // Draw signature
      page.drawImage(signatureImage, {
        x: field.xPosition,
        y: height - field.yPosition - field.height,
        width: field.width,
        height: field.height,
      });

      const pdfBytes = await pdfDoc.save();
      const fullOutputPath = path.join(__dirname, '..', outputPath);
      await fs.writeFile(fullOutputPath, pdfBytes);

      return {
        success: true,
        outputPath,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      console.error('❌ Error embedding signature:', error);
      throw error;
    }
  }

  /**
   * Generate final signed PDF with all fields and signatures
   */
  async generateSignedPDF(templatePath, fieldValues, outputPath) {
    try {
      const pdfDoc = await this.loadPDF(templatePath);
      const pages = pdfDoc.getPages();

      for (const fieldValue of fieldValues) {
        const page = pages[(fieldValue.pageNumber || 1) - 1];
        if (!page) continue;

        const { width, height } = page.getSize();

        // Handle different field types
        if (fieldValue.fieldType === 'signature' && fieldValue.signatureData) {
          // Embed signature image
          const signatureImageBytes = Buffer.from(fieldValue.signatureData.split(',')[1], 'base64');
          const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

          page.drawImage(signatureImage, {
            x: fieldValue.xPosition || 50,
            y: height - (fieldValue.yPosition || 50) - (fieldValue.height || 50),
            width: fieldValue.width || 200,
            height: fieldValue.height || 50,
          });
        } else if (fieldValue.value) {
          // Draw text value
          page.drawText(String(fieldValue.value), {
            x: (fieldValue.xPosition || 50) + 5,
            y: height - (fieldValue.yPosition || 50) - (fieldValue.height || 20) / 2,
            size: 10,
            color: rgb(0, 0, 0),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const fullOutputPath = path.join(__dirname, '..', outputPath);
      
      // Ensure directory exists
      const dir = path.dirname(fullOutputPath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(fullOutputPath, pdfBytes);

      return {
        success: true,
        outputPath,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      console.error('❌ Error generating signed PDF:', error);
      throw error;
    }
  }
}

module.exports = new PDFService();

