import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Note: CSS imports are optional for react-pdf
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

// Configure PDF.js worker - use local file from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

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

const SidebarStyle = styled(Paper)(({ theme }) => ({
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
});

const FieldOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fieldType',
})(({ theme, fieldType }) => {
  const field = FIELD_TYPES.find(f => f.value === fieldType);
  return {
    position: 'absolute',
    border: `2px dashed ${field?.color || theme.palette.primary.main}`,
    backgroundColor: alpha(field?.color || theme.palette.primary.main, 0.1),
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: field?.color || theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(field?.color || theme.palette.primary.main, 0.2),
      borderStyle: 'solid',
    },
  };
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
  const [pdfDimensions, setPdfDimensions] = useState({ width: 800, height: 1000 });
  const pdfContainerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const handleDragStart = (fieldType) => {
    setDraggingFieldType(fieldType);
  };

  const handleDragEnd = () => {
    setDraggingFieldType(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggingFieldType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to percentage
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    const newField = {
      id: `field_${Date.now()}`,
      field_name: `${draggingFieldType}_${fields.length + 1}`,
      field_type: draggingFieldType,
      x_pos: xPercent,
      y_pos: yPercent,
      width: draggingFieldType === 'signature' ? 25 : draggingFieldType === 'checkbox' ? 5 : 20,
      height: draggingFieldType === 'checkbox' ? 5 : 8,
      page_number: pageNumber,
      is_required: true,
    };

    setFields([...fields, newField]);
    setSelectedField(newField.id);
    setDraggingFieldType(null);
  };

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

          <Stack spacing={1}>
            {FIELD_TYPES.map((field) => (
              <FieldButton
                key={field.value}
                fieldType={field.value}
                variant="outlined"
                fullWidth
                draggable
                onDragStart={() => handleDragStart(field.value)}
                onDragEnd={handleDragEnd}
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
                    <Stack direction="row" alignItems="center" spacing={1}>
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
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setSelectedField(null)}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <Box sx={{ p: 4, textAlign: 'center', color: 'white' }}>
                  <Typography>Loading PDF...</Typography>
                </Box>
              }
            >
              <Page
                pageNumber={pageNumber}
                width={pdfDimensions.width}
                onLoadSuccess={(page) => {
                  setPdfDimensions({
                    width: page.width,
                    height: page.height,
                  });
                }}
              />
            </Document>

            {/* Field Overlays */}
            {currentPageFields.map((field) => {
              const fieldType = FIELD_TYPES.find(f => f.value === field.field_type);
              return (
                <FieldOverlay
                  key={field.id}
                  fieldType={field.field_type}
                  onClick={(e) => handleFieldClick(field.id, e)}
                  sx={{
                    left: `${field.x_pos}%`,
                    top: `${field.y_pos}%`,
                    width: `${field.width}%`,
                    height: `${field.height}%`,
                    outline: selectedField === field.id ? `3px solid ${fieldType?.color}` : 'none',
                  }}
                >
                  <Iconify icon={fieldType?.icon} width={20} />
                </FieldOverlay>
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
                  handleFieldUpdate(selectedFieldData.id, { x_pos: parseFloat(e.target.value) })
                }
                size="small"
                sx={{ width: '50%' }}
              />
              <TextField
                label="Y %"
                type="number"
                value={Math.round(selectedFieldData.y_pos)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { y_pos: parseFloat(e.target.value) })
                }
                size="small"
                sx={{ width: '50%' }}
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <TextField
                label="Width %"
                type="number"
                value={Math.round(selectedFieldData.width)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { width: parseFloat(e.target.value) })
                }
                size="small"
                sx={{ width: '50%' }}
              />
              <TextField
                label="Height %"
                type="number"
                value={Math.round(selectedFieldData.height)}
                onChange={(e) =>
                  handleFieldUpdate(selectedFieldData.id, { height: parseFloat(e.target.value) })
                }
                size="small"
                sx={{ width: '50%' }}
              />
            </Stack>

            <Alert severity="info" sx={{ mt: 2 }}>
              Click and drag to reposition. Use properties to fine-tune.
            </Alert>
          </Stack>
        </SidebarStyle>
      )}
    </RootStyle>
  );
}

