import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Document Name', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'size', label: 'Size', align: 'right' },
  { id: 'uploadedBy', label: 'Uploaded By', align: 'left' },
  { id: 'uploadDate', label: 'Upload Date', align: 'left' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_DOCUMENTS = [
  { id: 1, name: 'Employee Handbook 2024', category: 'Policies', type: 'PDF', size: '2.4 MB', uploadedBy: 'HR Admin', uploadDate: '2024-01-15' },
  { id: 2, name: 'Code of Conduct', category: 'Policies', type: 'PDF', size: '1.8 MB', uploadedBy: 'HR Admin', uploadDate: '2024-02-20' },
  { id: 3, name: 'Leave Policy', category: 'HR Policies', type: 'DOCX', size: '856 KB', uploadedBy: 'Jane Smith', uploadDate: '2024-03-10' },
  { id: 4, name: 'Safety Guidelines', category: 'Safety', type: 'PDF', size: '3.2 MB', uploadedBy: 'Safety Officer', uploadDate: '2024-04-05' },
];

// ----------------------------------------------------------------------

export default function DocumentLibraryPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const [tableData] = useState(MOCK_DOCUMENTS);

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'eva:file-text-fill';
      case 'docx':
      case 'doc': return 'eva:file-fill';
      case 'xlsx':
      case 'xls': return 'eva:file-fill';
      default: return 'eva:file-fill';
    }
  };

  const getFileColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'error';
      case 'docx':
      case 'doc': return 'info';
      case 'xlsx':
      case 'xls': return 'success';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Documents: Library | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Document Library"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Documents' },
            { name: 'Library' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:cloud-upload-fill" />}>
              Upload Document
            </Button>
          }
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon={getFileIcon(row.type)} width={24} color="text.secondary" />
                            <Typography variant="subtitle2">{row.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={row.type} 
                            size="small" 
                            color={getFileColor(row.type)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {row.size}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.uploadedBy}</TableCell>
                        <TableCell>{row.uploadDate}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <Iconify icon="eva:eye-fill" />
                          </IconButton>
                          <IconButton size="small">
                            <Iconify icon="eva:download-fill" />
                          </IconButton>
                          <IconButton size="small">
                            <Iconify icon="eva:share-fill" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {tableData.length === 0 && <TableNoData isNotFound={true} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={tableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

