import React, { memo, useCallback } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Grid,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Sort,
} from '@mui/icons-material';
import { TodoFilters as TodoFiltersType, Priority, Status, SortField, SortOrder } from '../types';

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFiltersChange: (filters: Partial<TodoFiltersType>) => void;
  onClearFilters: () => void;
  todoCount: number;
}

const TodoFilters: React.FC<TodoFiltersProps> = memo(({
  filters,
  onFiltersChange,
  onClearFilters,
  todoCount,
}) => {
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  }, [onFiltersChange]);

  const handlePriorityChange = useCallback((event: any) => {
    onFiltersChange({ priority: event.target.value as Priority });
  }, [onFiltersChange]);

  const handleStatusChange = useCallback((event: any) => {
    onFiltersChange({ status: event.target.value as Status });
  }, [onFiltersChange]);

  const handleSortByChange = useCallback((event: any) => {
    onFiltersChange({ sortBy: event.target.value as SortField });
  }, [onFiltersChange]);

  const handleSortOrderChange = useCallback((event: any) => {
    onFiltersChange({ sortOrder: event.target.value as SortOrder });
  }, [onFiltersChange]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.search !== '' ||
      filters.priority !== 'all' ||
      filters.status !== 'all' ||
      filters.sortBy !== 'createdAt' ||
      filters.sortOrder !== 'desc'
    );
  }, [filters]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterList color="primary" sx={{ mr: 1 }} />
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            placeholder="Search todos..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
          />
        </Box>
        {hasActiveFilters() && (
          <Tooltip title="Clear all filters">
            <IconButton onClick={onClearFilters} size="small">
              <Clear />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              onChange={handlePriorityChange}
              label="Priority"
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={handleSortByChange}
              label="Sort By"
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder}
              onChange={handleSortOrderChange}
              label="Order"
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`${todoCount} todo${todoCount !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          
          {filters.search && (
            <Chip
              label={`Search: "${filters.search}"`}
              onDelete={() => onFiltersChange({ search: '' })}
              size="small"
            />
          )}
          
          {filters.priority !== 'all' && (
            <Chip
              label={`Priority: ${filters.priority}`}
              onDelete={() => onFiltersChange({ priority: 'all' })}
              size="small"
            />
          )}
          
          {filters.status !== 'all' && (
            <Chip
              label={`Status: ${filters.status}`}
              onDelete={() => onFiltersChange({ status: 'all' })}
              size="small"
            />
          )}
          
          <Chip
            label={`Sort: ${filters.sortBy} (${filters.sortOrder})`}
            onDelete={() => onFiltersChange({ sortBy: 'createdAt', sortOrder: 'desc' })}
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
});

TodoFilters.displayName = 'TodoFilters';

export default TodoFilters;
