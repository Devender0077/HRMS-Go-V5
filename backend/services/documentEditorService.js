const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

/**
 * Document Editor Service
 * Provides comprehensive PDF and Word document editing features
 * Similar to DocuSign, Adobe Sign, PDFtron
 */

class DocumentEditorService {
  /**
   * WORD DOCUMENT FEATURES
   */

  // Convert Word document to PDF
  async convertWordToPdf(wordFilePath, outputPdfPath) {
    try {
      const wordBuffer = await fs.readFile(wordFilePath);
      const result = await mammoth.extractRawText({ buffer: wordBuffer });
      const text = result.value;

      // Create new PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;

      // Split text into lines and add to PDF
      const lines = text.split('\n');
      let yPosition = height - 50;

      for (const line of lines) {
        if (yPosition < 50) {
          // Add new page if running out of space
          const newPage = pdfDoc.addPage();
          yPosition = newPage.getSize().height - 50;
        }
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font,
        });
        yPosition -= fontSize + 5;
      }

      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPdfPath, pdfBytes);
      
      return {
        success: true,
        path: outputPdfPath,
        message: 'Word document converted to PDF successfully',
      };
    } catch (error) {
      console.error('Error converting Word to PDF:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * PDF EDITING FEATURES
   */

  // Add watermark to PDF
  async addWatermark(pdfPath, watermarkText, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 100,
          y: height / 2,
          size: 50,
          font,
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.3,
          rotate: degrees(45),
        });
      }

      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath };
    } catch (error) {
      console.error('Error adding watermark:', error);
      return { success: false, error: error.message };
    }
  }

  // Compress PDF
  async compressPdf(pdfPath, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Save with compression
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      await fs.writeFile(outputPath, pdfBytes);
      
      const originalSize = existingPdfBytes.length;
      const compressedSize = pdfBytes.length;
      const savedPercentage = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

      return {
        success: true,
        path: outputPath,
        originalSize,
        compressedSize,
        savedPercentage,
      };
    } catch (error) {
      console.error('Error compressing PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Edit PDF metadata
  async editMetadata(pdfPath, metadata, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      if (metadata.title) pdfDoc.setTitle(metadata.title);
      if (metadata.author) pdfDoc.setAuthor(metadata.author);
      if (metadata.subject) pdfDoc.setSubject(metadata.subject);
      if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords.split(','));
      if (metadata.creator) pdfDoc.setCreator(metadata.creator);
      if (metadata.producer) pdfDoc.setProducer(metadata.producer);

      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath };
    } catch (error) {
      console.error('Error editing metadata:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * PDF ORGANIZATION FEATURES
   */

  // Merge multiple PDFs
  async mergePdfs(pdfPaths, outputPath) {
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfPath of pdfPaths) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath, pageCount: mergedPdf.getPageCount() };
    } catch (error) {
      console.error('Error merging PDFs:', error);
      return { success: false, error: error.message };
    }
  }

  // Extract pages from PDF
  async extractPages(pdfPath, pageNumbers, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdf = await PDFDocument.create();

      const pages = await newPdf.copyPages(pdfDoc, pageNumbers.map(n => n - 1));
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath, extractedPages: pageNumbers.length };
    } catch (error) {
      console.error('Error extracting pages:', error);
      return { success: false, error: error.message };
    }
  }

  // Rotate pages
  async rotatePages(pdfPath, rotation, pageNumbers, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      const pagesToRotate = pageNumbers || pages.map((_, i) => i + 1);

      for (const pageNum of pagesToRotate) {
        const pageIndex = pageNum - 1;
        if (pageIndex >= 0 && pageIndex < pages.length) {
          const page = pages[pageIndex];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        }
      }

      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath };
    } catch (error) {
      console.error('Error rotating pages:', error);
      return { success: false, error: error.message };
    }
  }

  // Reorder pages
  async reorderPages(pdfPath, newOrder, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdf = await PDFDocument.create();

      const pages = await newPdf.copyPages(pdfDoc, newOrder.map(n => n - 1));
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath };
    } catch (error) {
      console.error('Error reordering pages:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete pages
  async deletePages(pdfPath, pageNumbers, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const totalPages = pdfDoc.getPageCount();

      // Get pages to keep (inverse of pages to delete)
      const pagesToKeep = [];
      for (let i = 1; i <= totalPages; i++) {
        if (!pageNumbers.includes(i)) {
          pagesToKeep.push(i - 1);
        }
      }

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, pagesToKeep);
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath, remainingPages: pagesToKeep.length };
    } catch (error) {
      console.error('Error deleting pages:', error);
      return { success: false, error: error.message };
    }
  }

  // Split PDF into separate files
  async splitPdf(pdfPath, outputDir) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const totalPages = pdfDoc.getPageCount();
      const outputPaths = [];

      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);

        const outputPath = path.join(outputDir, `page_${i + 1}.pdf`);
        const pdfBytes = await newPdf.save();
        await fs.writeFile(outputPath, pdfBytes);
        outputPaths.push(outputPath);
      }

      return { success: true, paths: outputPaths, totalPages };
    } catch (error) {
      console.error('Error splitting PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * SIGNING FEATURES
   */

  // Add text annotation to PDF
  async addTextAnnotation(pdfPath, text, x, y, pageNumber, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      if (pageNumber > 0 && pageNumber <= pages.length) {
        const page = pages[pageNumber - 1];
        page.drawText(text, {
          x,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath };
    } catch (error) {
      console.error('Error adding text annotation:', error);
      return { success: false, error: error.message };
    }
  }

  // Add stamp to PDF
  async addStamp(pdfPath, stampText, x, y, pageNumber, outputPath) {
    try {
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      if (pageNumber > 0 && pageNumber <= pages.length) {
        const page = pages[pageNumber - 1];
        
        // Draw stamp background
        page.drawRectangle({
          x: x - 5,
          y: y - 5,
          width: 150,
          height: 40,
          borderColor: rgb(1, 0, 0),
          borderWidth: 2,
          color: rgb(1, 0.95, 0.95),
          opacity: 0.5,
        });

        // Draw stamp text
        page.drawText(stampText, {
          x,
          y,
          size: 14,
          font,
          color: rgb(1, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);
      
      return { success: true, path: outputPath };
    } catch (error) {
      console.error('Error adding stamp:', error);
      return { success: false, error: error.message };
    }
  }

  // Get PDF info
  async getPdfInfo(pdfPath) {
    try {
      const pdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      return {
        success: true,
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
      };
    } catch (error) {
      console.error('Error getting PDF info:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DocumentEditorService();

