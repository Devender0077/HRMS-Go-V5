import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// @mui
import {
  Box,
  Paper,
  Button,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Configure PDF.js worker globally
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// ----------------------------------------------------------------------

const FIELD_TYPES = [
  { value: 'signature', label: 'Signature', icon: 'mdi:draw', color: '#00AB55' },
  { value: 'text', label: 'Text', icon: 'mdi:form-textbox', color: '#1890FF' },
  { value: 'date', label: 'Date', icon: 'mdi:calendar', color: '#7635dc' },
  { value: 'checkbox', label: 'Checkbox', icon: 'mdi:checkbox-marked', color: '#FFC107' },
  { value: 'initials', label: 'Initials', icon: 'mdi:format-letter-case', color: '#00D9A5' },
];

const RootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 200px)',
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const SidebarStyle = styled(Paper)(({ theme}) => ({
  width: 280,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const ContentStyle = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const PDFContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  overflow: 'auto',
  backgroundColor: '#525659',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const PDFWrapper = styled(Box)({
  position: 'relative',
  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
  display: 'inline-block', // Wrapper shrinks to PDF size
});

const FieldButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'fieldType',
})(({ theme, fieldType }) => {
  const field = FIELD_TYPES.find(f => f.value === fieldType);
  return {
    justifyContent: 'flex-start',
    borderColor: alpha(field?.color || theme.palette.primary.main, 0.3),
    color: field?.color || theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(field?.color || theme.palette.primary.main, 0.08),
      borderColor: field?.color || theme.palette.primary.main,
    },
  };
});

// ----------------------------------------------------------------------

export default function PDFFieldEditor({ pdfUrl, initialFields = [], onSave, onCancel }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fields, setFields] = useState(initialFields);
  const [selectedField, setSelectedField] = useState(null);
  const [draggingFieldType, setDraggingFieldType] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 800, height: 1000 });
  const pdfWrapperRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [copiedField, setCopiedField] = useState(null);

  // Memoize options to prevent unnecessary reloads
  const documentOptions = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  }), []);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  // Improved auto-detect form fields based on common patterns
  const handleAutoDetect = useCallback(async () => {
    try {
      const detectedFields = [];
      const timestamp = Date.now();
      
      // Common form field patterns to detect
      const patterns = [
        // Name fields (usually at top, 15-25% from top)
        { name: 'employee_name', label: 'Full Name', type: 'text', y: 20, width: 35, height: 5 },
        { name: 'print_name', label: 'Print Name', type: 'text', y: 25, width: 35, height: 5 },
        
        // Contact fields (middle section, 30-50%)
        { name: 'email', label: 'Email', type: 'text', y: 35, width: 35, height: 5 },
        { name: 'phone', label: 'Phone', type: 'text', y: 40, width: 25, height: 5 },
        { name: 'address', label: 'Address', type: 'text', y: 45, width: 45, height: 5 },
        
        // Bank/Account fields (if in document, 50-70%)
        { name: 'routing_number', label: 'Routing Number', type: 'text', y: 55, width: 25, height: 5 },
        { name: 'account_number', label: 'Account Number', type: 'text', y: 60, width: 25, height: 5 },
        
        // Signature fields (bottom, 75-90%)
        { name: 'employee_signature', label: 'Signature', type: 'signature', y: 82, width: 30, height: 8 },
        { name: 'account_holder_signature', label: 'Account Holder Signature', type: 'signature', y: 85, width: 30, height: 8 },
        
        // Date fields (bottom, next to signature, 75-90%)
        { name: 'date_signed', label: 'Date', type: 'date', y: 82, width: 20, height: 5, x: 55 },
        { name: 'signature_date', label: 'Signature Date', type: 'date', y: 85, width: 20, height: 5, x: 55 },
        
        // Checkbox fields (usually middle, 40-60%)
        { name: 'agree_to_terms', label: 'I Agree', type: 'checkbox', y: 70, width: 4, height: 4 },
        
        // Initials (usually bottom right, 75-85%)
        { name: 'initials', label: 'Initials', type: 'initials', y: 88, width: 15, height: 5, x: 75 },
      ];
      
      // Add fields with spacing to avoid overlaps
      patterns.forEach((pattern, index) => {
        const xPos = pattern.x || 10 + (index % 2) * 5; // Stagger x position slightly
        
        detectedFields.push({
          id: `field_${timestamp}_${index}`,
          field_name: pattern.name,
          field_type: pattern.type,
          x_pos: xPos,
          y_pos: pattern.y,
          width: pattern.width,
          height: pattern.height,
          page_number: pageNumber,
          is_required: pattern.type === 'signature' || pattern.type === 'date',
        });
      });
      
      // Only add fields that don't conflict with existing ones
      const newFields = detectedFields.filter(newField => {
        return !fields.some(existingField => 
          existingField.field_name === newField.field_name &&
          existingField.page_number === newField.page_number
        );
      });
      
      setFields([...fields, ...newFields]);
    } catch (error) {
      console.error('Error auto-detecting fields:', error);
    }
  }, [fields, pageNumber]);

  // Drag from palette
  const handlePaletteDragStart = (fieldType) => {
    setDraggingFieldType(fieldType);
  };

  const handlePaletteDragEnd = () => {
    setDraggingFieldType(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggingFieldType || !pdfWrapperRef.current) return;

    const wrapper = pdfWrapperRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Get mouse position relative to PDF wrapper
    // This naturally accounts for scroll because getBoundingClientRect gives viewport position
    const relativeX = e.clientX - wrapperRect.left;
    const relativeY = e.clientY - wrapperRect.top;
    
    // Convert to percentage of wrapper dimensions
    const xPercent = (relativeX / wrapperRect.width) * 100;
    const yPercent = (relativeY / wrapperRect.height) * 100;

    const newField = {
      id: `field_${Date.now()}`,
      field_name: `${draggingFieldType}_${fields.length + 1}`,
      field_type: draggingFieldType,
      x_pos: Math.max(0, Math.min(90, xPercent)),
      y_pos: Math.max(0, Math.min(95, yPercent)),
      width: draggingFieldType === 'signature' ? 25 : draggingFieldType === 'checkbox' ? 5 : 20,
      height: draggingFieldType === 'checkbox' ? 5 : 8,
      page_number: pageNumber,
      is_required: true,
    };

    console.log('📍 Field dropped at:', { 
      xPercent: newField.x_pos.toFixed(2), 
      yPercent: newField.y_pos.toFixed(2),
      mouseY: e.clientY,
      wrapperTop: wrapperRect.top,
      relativeY,
      wrapperHeight: wrapperRect.height
    });

    setFields([...fields, newField]);
    setSelectedField(newField.id);
    setDraggingFieldType(null);
  };

  // Drag existing field to reposition
  const handleFieldMouseDown = (e, fieldId) => {
    e.stopPropagation();
    e.preventDefault();
    
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    setDraggedField(fieldId);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      fieldX: field.x_pos,
      fieldY: field.y_pos,
    });
    setSelectedField(fieldId);
  };

  const handleMouseMove = useCallback((e) => {
    if (!pdfWrapperRef.current || !pdfContainerRef.current) return;

    // Handle field dragging with scroll support
    if (draggedField && dragStart) {
      e.preventDefault();
      
      // Auto-scroll when near edges
      const container = pdfContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollThreshold = 50;
      
      if (e.clientY < containerRect.top + scrollThreshold && container.scrollTop > 0) {
        container.scrollTop -= 5;
      } else if (e.clientY > containerRect.bottom - scrollThreshold) {
        container.scrollTop += 5;
      }
      
      // Simple approach: calculate position relative to wrapper
      const wrapper = pdfWrapperRef.current;
      const wrapperRect = wrapper.getBoundingClientRect();
      
      const deltaX = e.clientX - dragStart.mouseX;
      const deltaY = e.clientY - dragStart.mouseY;
      
      // Convert pixel delta to percentage delta based on wrapper dimensions
      const deltaXPercent = (deltaX / wrapperRect.width) * 100;
      const deltaYPercent = (deltaY / wrapperRect.height) * 100;
      
      const newX = Math.max(0, Math.min(90, dragStart.fieldX + deltaXPercent));
      const newY = Math.max(0, Math.min(95, dragStart.fieldY + deltaYPercent));

      setFields(fields.map(f => 
        f.id === draggedField 
          ? { ...f, x_pos: newX, y_pos: newY }
          : f
      ));
    }

    // Handle field resizing
    if (resizeHandle && resizeHandle.fieldId && dragStart) {
      e.preventDefault();
      const rect = pdfWrapperRef.current.getBoundingClientRect();
      const field = fields.find(f => f.id === resizeHandle.fieldId);
      if (!field) return;

      const deltaX = e.clientX - dragStart.mouseX;
      const deltaY = e.clientY - dragStart.mouseY;
      
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      
      let newWidth = field.width;
      let newHeight = field.height;
      let newX = field.x_pos;
      let newY = field.y_pos;

      // Handle different resize handles
      if (resizeHandle.direction.includes('e')) {
        newWidth = Math.max(5, field.width + deltaXPercent);
      }
      if (resizeHandle.direction.includes('w')) {
        newWidth = Math.max(5, field.width - deltaXPercent);
        newX = field.x_pos + deltaXPercent;
      }
      if (resizeHandle.direction.includes('s')) {
        newHeight = Math.max(3, field.height + deltaYPercent);
      }
      if (resizeHandle.direction.includes('n')) {
        newHeight = Math.max(3, field.height - deltaYPercent);
        newY = field.y_pos + deltaYPercent;
      }

      setFields(fields.map(f => 
        f.id === resizeHandle.fieldId 
          ? { ...f, width: newWidth, height: newHeight, x_pos: newX, y_pos: newY }
          : f
      ));
      
      setDragStart({ ...dragStart, mouseX: e.clientX, mouseY: e.clientY });
    }
  }, [draggedField, dragStart, resizeHandle, fields]);

  const handleMouseUp = useCallback(() => {
    setDraggedField(null);
    setDragStart(null);
    setResizeHandle(null);
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (!selectedField) return;

    const field = fields.find(f => f.id === selectedField);
    if (!field) return;

    const moveStep = e.shiftKey ? 5 : 1; // Shift = faster movement

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleFieldUpdate(selectedField, { y_pos: Math.max(0, field.y_pos - moveStep) });
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleFieldUpdate(selectedField, { y_pos: Math.min(98, field.y_pos + moveStep) });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleFieldUpdate(selectedField, { x_pos: Math.max(0, field.x_pos - moveStep) });
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleFieldUpdate(selectedField, { x_pos: Math.min(95, field.x_pos + moveStep) });
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        handleFieldDelete(selectedField);
        break;
      case 'c':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setCopiedField({ ...field });
          console.log('📋 Field copied:', field.field_name);
        }
        break;
      case 'v':
        if ((e.ctrlKey || e.metaKey) && copiedField) {
          e.preventDefault();
          const newField = {
            ...copiedField,
            id: `field_${Date.now()}`,
            field_name: `${copiedField.field_name}_copy`,
            x_pos: Math.min(95, copiedField.x_pos + 5),
            y_pos: Math.min(98, copiedField.y_pos + 5), // Allow paste at bottom
            page_number: pageNumber,
          };
          setFields([...fields, newField]);
          setSelectedField(newField.id);
          console.log('📋 Field pasted:', newField.field_name);
        }
        break;
      case 'd':
        if ((e.ctrlKey || e.metaKey) && field) {
          e.preventDefault();
          const duplicate = {
            ...field,
            id: `field_${Date.now()}`,
            field_name: `${field.field_name}_copy`,
            x_pos: Math.min(95, field.x_pos + 5),
            y_pos: Math.min(98, field.y_pos + 5), // Allow duplicate at bottom
          };
          setFields([...fields, duplicate]);
          setSelectedField(duplicate.id);
          console.log('📋 Field duplicated:', duplicate.field_name);
        }
        break;
      default:
        break;
    }
  }, [selectedField, fields, copiedField, pageNumber]);

  // Attach global mouse and keyboard events
  React.useEffect(() => {
    if (draggedField || resizeHandle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedField, resizeHandle, handleMouseMove, handleMouseUp]);

  // Keyboard shortcuts
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleFieldClick = (fieldId, e) => {
    e.stopPropagation();
    setSelectedField(fieldId);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const handleFieldDelete = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(fields);
    }
  };

  const handleResizeStart = (e, fieldId, direction) => {
    e.stopPropagation();
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    setResizeHandle({ fieldId, direction });
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
    setSelectedField(fieldId);
  };

  const currentPageFields = fields.filter(f => f.page_number === pageNumber);
  const selectedFieldData = fields.find(f => f.id === selectedField);

  return (
    <RootStyle>
      {/* LEFT SIDEBAR - Field Palette */}
      <SidebarStyle>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography variant="h6">Field Palette</Typography>
          <Typography variant="caption" color="text.secondary">
            Drag fields onto the PDF to place them
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
            startIcon={<Iconify icon="eva:flash-fill" />}
            onClick={handleAutoDetect}
          >
            Auto-Detect Fields
          </Button>

          <Divider />

          <Stack spacing={1}>
            {FIELD_TYPES.map((field) => (
              <FieldButton
                key={field.value}
                fieldType={field.value}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={() => handlePaletteDragStart(field.value)}
                onDragEnd={handlePaletteDragEnd}
                startIcon={<Iconify icon={field.icon} />}
              >
                {field.label}
              </FieldButton>
            ))}
          </Stack>

          <Divider />

          <Typography variant="subtitle2">
            Fields ({fields.length})
          </Typography>

          <Scrollbar sx={{ maxHeight: 300 }}>
            <Stack spacing={0.5}>
              {fields.map((field) => {
                const fieldType = FIELD_TYPES.find(f => f.value === field.field_type);
                return (
                  <Paper
                    key={field.id}
                    variant="outlined"
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      bgcolor: selectedField === field.id ? 'action.selected' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <Stack direction="row" alignments="center" spacing={1}>
                      <Iconify icon={fieldType?.icon} width={16} sx={{ color: fieldType?.color }} />
                      <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                        {field.field_name}
                      </Typography>
                      <Chip label={`Page ${field.page_number}`} size="small" />
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Scrollbar>
        </Stack>
      </SidebarStyle>

      {/* CENTER - PDF Viewer */}
      <ContentStyle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>
            <Typography variant="body2">
              Page {pageNumber} of {numPages || '?'}
            </Typography>
            <IconButton
              size="small"
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:save-fill" />}
              onClick={handleSave}
              disabled={fields.length === 0}
            >
              Save Fields ({fields.length})
            </Button>
          </Stack>
        </Stack>

        <PDFContainer ref={pdfContainerRef}>
          <PDFWrapper
            ref={pdfWrapperRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setSelectedField(null)}
            sx={{
              width: pdfDimensions.width,
              height: pdfDimensions.height,
            }}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              options={documentOptions}
              loading={
                <Box sx={{ p: 4, textAlign: 'center', color: 'white' }}>
                  <Typography>Loading PDF...</Typography>
                </Box>
              }
            >
              <Page
                pageNumber={pageNumber}
                width={pdfDimensions.width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={(page) => {
                  setPdfDimensions({
                    width: page.width,
                    height: page.height,
                  });
                }}
              />
            </Document>

            {/* Field Overlays with Drag & Resize */}
            {currentPageFields.map((field) => {
              const fieldType = FIELD_TYPES.find(f => f.value === field.field_type);
              const isSelected = selectedField === field.id;

              return (
                <Box
                  key={field.id}
                  onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                  onClick={(e) => handleFieldClick(field.id, e)}
                  sx={{
                    position: 'absolute',
                    left: `${field.x_pos}%`,
                    top: `${field.y_pos}%`,
                    width: `${field.width}%`,
                    height: `${field.height}%`,
                    border: `2px ${isSelected ? 'solid' : 'dashed'} ${fieldType?.color || '#1890FF'}`,
                    backgroundColor: alpha(fieldType?.color || '#1890FF', isSelected ? 0.15 : 0.1),
                    cursor: draggedField === field.id ? 'grabbing' : 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    color: fieldType?.color || '#1890FF',
                    userSelect: 'none',
                    '&:hover': {
                      backgroundColor: alpha(fieldType?.color || '#1890FF', 0.2),
                      borderStyle: 'solid',
                    },
                  }}
                >
                  <Iconify icon={fieldType?.icon} width={20} />
                  
                  {/* Resize Handles - Only show when selected */}
                  {isSelected && (
                    <>
                      {/* Top-left */}
                      <Box
                        onMouseDown={(e) => handleResizeStart(e, field.id, 'nw')}
                        sx={{
                          position: 'absolute',
                          top: -4,
                          left: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#fff',
                          border: `2px solid ${fieldType?.color}`,
                          cursor: 'nw-resize',
                          borderRadius: '50%',
                          '&:hover': { transform: 'scale(1.3)' },
                        }}
                      />
                      {/* Top-right */}
                      <Box
                        onMouseDown={(e) => handleResizeStart(e, field.id, 'ne')}
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#fff',
                          border: `2px solid ${fieldType?.color}`,
                          cursor: 'ne-resize',
                          borderRadius: '50%',
                          '&:hover': { transform: 'scale(1.3)' },
                        }}
                      />
                      {/* Bottom-left */}
                      <Box
                        onMouseDown={(e) => handleResizeStart(e, field.id, 'sw')}
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          left: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#fff',
                          border: `2px solid ${fieldType?.color}`,
                          cursor: 'sw-resize',
                          borderRadius: '50%',
                          '&:hover': { transform: 'scale(1.3)' },
                        }}
                      />
                      {/* Bottom-right */}
                      <Box
                        onMouseDown={(e) => handleResizeStart(e, field.id, 'se')}
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#fff',
                          border: `2px solid ${fieldType?.color}`,
                          cursor: 'se-resize',
                          borderRadius: '50%',
                          '&:hover': { transform: 'scale(1.3)' },
                        }}
                      />
                      {/* Middle handles */}
                      <Box
                        onMouseDown={(e) => handleResizeStart(e, field.id, 'e')}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          right: -4,
                          width: 8,
                          height: 8,
                          backgroundColor: '#fff',
                          border: `2px solid ${fieldType?.color}`,
                          cursor: 'e-resize',
                          borderRadius: '50%',
                          transform: 'translateY(-50%)',
                          '&:hover': { transform: 'translateY(-50%) scale(1.3)' },
                        }}
                      />
                      <Box
                        onMouseDown={(e) => handleResizeStart(e, field.id, 's')}
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          left: '50%',
                          width: 8,
                          height: 8,
                          backgroundColor: '#fff',
                          border: `2px solid ${fieldType?.color}`,
                          cursor: 's-resize',
                          borderRadius: '50%',
                          transform: 'translateX(-50%)',
                          '&:hover': { transform: 'translateX(-50%) scale(1.3)' },
                        }}
                      />
                    </>
                  )}
                </Box>
              );
            })}
          </PDFWrapper>
        </PDFContainer>
      </ContentStyle>

      {/* RIGHT SIDEBAR - Field Properties */}
      {selectedFieldData && (
        <SidebarStyle>
          <Stack spacing={2} sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Field Properties</Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleFieldDelete(selectedFieldData.id)}
              >
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Stack>

            <TextField
              fullWidth
              label="Field Name"
              value={selectedFieldData.field_name}
              onChange={(e) =>
                handleFieldUpdate(selectedFieldData.id, { field_name: e.target.value })
              }
              size="small"
            />

            <TextField
              fullWidth
              select
              label="Field Type"
              value={selectedFieldData.field_type}
              onChange={(e) =>
                handleFieldUpdate(selectedFieldData.id, { field_type: e.target.value })
              }
              size="small"
            >
              {FIELD_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon={option.icon} width={16} sx={{ color: option.color }} />
                    <span>{option.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={selectedFieldData.is_required}
                  onChange={(e) =>
                    handleFieldUpdate(selectedFieldData.id, { is_required: e.target.checked })
                  }
                />
              }
              label="Required"
            />

            <Divider />

            <Typography variant="caption" color="text.secondary">
              Position & Size
            </Typography>

            <Stack direction="row" spacing={1}>
              <TextField
                label="X %"
                type="number"
                value={Math.round(selectedFieldData.x_pos)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { x_pos: parseFloat(e.target.value) || 0 })
                }
                size="small"
                sx={{ width: '50%' }}
                inputProps={{ min: 0, max: 100, step: 1 }}
              />
              <TextField
                label="Y %"
                type="number"
                value={Math.round(selectedFieldData.y_pos)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { y_pos: parseFloat(e.target.value) || 0 })
                }
                size="small"
                sx={{ width: '50%' }}
                inputProps={{ min: 0, max: 100, step: 1 }}
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <TextField
                label="Width %"
                type="number"
                value={Math.round(selectedFieldData.width)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { width: parseFloat(e.target.value) || 5 })
                }
                size="small"
                sx={{ width: '50%' }}
                inputProps={{ min: 5, max: 100, step: 1 }}
              />
              <TextField
                label="Height %"
                type="number"
                value={Math.round(selectedFieldData.height)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { height: parseFloat(e.target.value) || 3 })
                }
                size="small"
                sx={{ width: '50%' }}
                inputProps={{ min: 3, max: 100, step: 1 }}
              />
            </Stack>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption" component="div">
                <strong>Mouse:</strong><br />
                • Drag field to reposition<br />
                • Drag corners/edges to resize<br />
                • Edit numbers for precision<br />
                <br />
                <strong>Keyboard:</strong><br />
                • ↑↓←→ Move field (Shift = 5x faster)<br />
                • Ctrl/Cmd+C Copy field<br />
                • Ctrl/Cmd+V Paste field<br />
                • Ctrl/Cmd+D Duplicate field<br />
                • Delete/Backspace Delete field
              </Typography>
            </Alert>
          </Stack>
        </SidebarStyle>
      )}
    </RootStyle>
  );
}

