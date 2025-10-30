import { apiClient } from './authService';

/**
 * Document Editor Service
 * Frontend service for PDF and Word document editing operations
 */

const documentEditorService = {
  // Word document operations
  convertWordToPdf: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/document-editor/convert-word-to-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // PDF editing operations
  addWatermark: async (templateId, watermarkText) => {
    const response = await apiClient.post('/api/document-editor/add-watermark', {
      templateId,
      watermarkText,
    });
    return response.data;
  },

  compressPdf: async (templateId) => {
    const response = await apiClient.post('/api/document-editor/compress', {
      templateId,
    });
    return response.data;
  },

  editMetadata: async (templateId, metadata) => {
    const response = await apiClient.post('/api/document-editor/edit-metadata', {
      templateId,
      metadata,
    });
    return response.data;
  },

  // PDF organization operations
  mergePdfs: async (templateIds) => {
    const response = await apiClient.post('/api/document-editor/merge', {
      templateIds,
    });
    return response.data;
  },

  extractPages: async (templateId, pageNumbers) => {
    const response = await apiClient.post('/api/document-editor/extract-pages', {
      templateId,
      pageNumbers,
    });
    return response.data;
  },

  rotatePages: async (templateId, rotation, pageNumbers = null) => {
    const response = await apiClient.post('/api/document-editor/rotate-pages', {
      templateId,
      rotation,
      pageNumbers,
    });
    return response.data;
  },

  reorderPages: async (templateId, newOrder) => {
    const response = await apiClient.post('/api/document-editor/reorder-pages', {
      templateId,
      newOrder,
    });
    return response.data;
  },

  deletePages: async (templateId, pageNumbers) => {
    const response = await apiClient.post('/api/document-editor/delete-pages', {
      templateId,
      pageNumbers,
    });
    return response.data;
  },

  splitPdf: async (templateId) => {
    const response = await apiClient.post('/api/document-editor/split', {
      templateId,
    });
    return response.data;
  },

  // Signing operations
  addTextAnnotation: async (templateId, text, x, y, pageNumber) => {
    const response = await apiClient.post('/api/document-editor/add-text-annotation', {
      templateId,
      text,
      x,
      y,
      pageNumber,
    });
    return response.data;
  },

  addStamp: async (templateId, stampText, x, y, pageNumber) => {
    const response = await apiClient.post('/api/document-editor/add-stamp', {
      templateId,
      stampText,
      x,
      y,
      pageNumber,
    });
    return response.data;
  },

  // PDF info
  getPdfInfo: async (templateId) => {
    const response = await apiClient.get(`/api/document-editor/info/${templateId}`);
    return response.data;
  },
};

export default documentEditorService;

