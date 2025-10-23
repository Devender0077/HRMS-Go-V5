import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Stack,
  Button,
  MenuItem,
  Divider,
} from '@mui/material';
// components
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
import { TableHeadCustom, TableNoData, TableSelectedAction } from '../table';
import MenuPopover from '../menu-popover';

// ----------------------------------------------------------------------

HRMSTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  selected: PropTypes.array,
  onSelectRow: PropTypes.func,
  onSelectAllRows: PropTypes.func,
  dense: PropTypes.bool,
  rowsPerPageOptions: PropTypes.array,
  searchPlaceholder: PropTypes.string,
  noDataText: PropTypes.string,
  actions: PropTypes.array,
  renderRow: PropTypes.func,
};

export default function HRMSTable({
  data = [],
  columns = [],
  onRowClick,
  onEdit,
  onDelete,
  onView,
  selected = [],
  onSelectRow,
  onSelectAllRows,
  dense = false,
  rowsPerPageOptions = [5, 10, 25],
  searchPlaceholder = 'Search...',
  noDataText = 'No data available',
  actions = [],
  renderRow,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [openPopover, setOpenPopover] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPopover = (event, row) => {
    setCurrentRow(row);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setCurrentRow(null);
  };

  const handleAction = (action) => {
    if (currentRow && action.onClick) {
      action.onClick(currentRow);
    }
    handleClosePopover();
  };

  const isNotFound = !data.length;

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            {selected && selected.length > 0 && (
              <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={data.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows &&
                  onSelectAllRows(
                    checked,
                    data.map((row) => row.id)
                  )
                }
                action={
                  <Stack direction="row" spacing={1}>
                    <Button
                      color="error"
                      variant="contained"
                      startIcon={<Iconify icon="eva:trash-2-outline" />}
                      onClick={() => onDelete && onDelete(selected)}
                    >
                      Delete
                    </Button>
                  </Stack>
                }
              />
            )}

            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                headLabel={columns}
                rowCount={data.length}
                numSelected={selected.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows &&
                  onSelectAllRows(
                    checked,
                    data.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {paginatedData.map((row) =>
                  renderRow ? renderRow(row, handleOpenPopover) : null
                )}

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top">
        {actions.map((action, index) => (
          <div key={index}>
            {action.divider && <Divider sx={{ my: 0.5 }} />}
            <MenuItem
              onClick={() => handleAction(action)}
              sx={{
                color: action.color || 'inherit',
                ...(action.sx || {}),
              }}
            >
              {action.icon && <Iconify icon={action.icon} sx={{ mr: 2 }} />}
              {action.label}
            </MenuItem>
          </div>
        ))}
      </MenuPopover>
    </>
  );
}

