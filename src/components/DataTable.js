import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  InputAdornment
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Refresh
} from '@mui/icons-material';

const DataTable = ({
  data = [],
  columns = [],
  title = '',
  loading = false,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  searchable = true,
  filterable = true,
  pagination = true,
  actions = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available'
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage, pagination]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleAction = (action) => {
    if (selectedRow) {
      switch (action) {
        case 'view':
          onView?.(selectedRow);
          break;
        case 'edit':
          onEdit?.(selectedRow);
          break;
        case 'delete':
          onDelete?.(selectedRow);
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const renderCellValue = (row, column) => {
    const value = row[column.field];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (column.type === 'chip') {
      return (
        <Chip
          label={value}
          size="small"
          color={column.chipColor || 'default'}
          variant="outlined"
        />
      );
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === 'datetime') {
      return new Date(value).toLocaleString();
    }

    return value;
  };

  return (
    <Paper sx={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
      border: '1px solid rgba(0,0,0,0.04)'
    }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton onClick={onRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
          )}
          {filterable && (
            <Button
              startIcon={<FilterList />}
              variant="outlined"
              size="small"
            >
              Filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(26, 35, 126, 0.05)' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    fontWeight: 600,
                    color: '#1a237e',
                    borderBottom: '2px solid rgba(26, 35, 126, 0.1)'
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#1a237e',
                    borderBottom: '2px solid rgba(26, 35, 126, 0.1)',
                    width: 80
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  <Typography color="textSecondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(26, 35, 126, 0.02)'
                    }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCellValue(row, column)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, row)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid rgba(0,0,0,0.08)',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: '#757575'
            }
          }}
        />
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 2
          }
        }}
      >
        {onView && (
          <MenuItem onClick={() => handleAction('view')}>
            <Visibility sx={{ mr: 1 }} />
            View
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handleAction('edit')}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => handleAction('delete')} sx={{ color: '#d32f2f' }}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default DataTable; 