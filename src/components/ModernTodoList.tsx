import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  alpha,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import { useFirebase } from '../hooks/useFirebase';
import { useApp } from '../hooks/useApp';
import ModernHeader from './ModernHeader';
import TodoCard from './TodoCard';
import TodoFilters from './TodoFilters';
import TodoSkeleton from './TodoSkeleton';
import EmptyState from './EmptyState';
import ModernFAB from './ModernFAB';
import TodoDialog from './TodoDialog';
import { TodoFormData, Todo } from '../types';

const ModernTodoList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    todos,
    loading,
    error,
    filters,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    updateFilters,
    clearFilters,
  } = useTodos();

  const { user, signOutUser } = useFirebase();
  const { addNotification } = useApp();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, updateFilters]);

  // Handlers
  const handleAddTodo = useCallback(() => {
    setEditingTodo(null);
    setShowAddDialog(true);
  }, []);

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setShowAddDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowAddDialog(false);
    setEditingTodo(null);
  }, []);

  const handleSubmitTodo = useCallback(async (data: TodoFormData) => {
    try {
      if (editingTodo) {
        const todoId = editingTodo.todoId || editingTodo.id;
        if (!todoId) {
          throw new Error('Todo ID is missing');
        }
        await updateTodo(todoId, data);
        setSnackbar({
          open: true,
          message: 'Todo updated successfully!',
          severity: 'success',
        });
        addNotification('Todo updated successfully!', 'success');
      } else {
        await addTodo(data);
        setSnackbar({
          open: true,
          message: 'Todo created successfully!',
          severity: 'success',
        });
        addNotification('Todo created successfully!', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving todo:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save todo. Please try again.',
        severity: 'error',
      });
      addNotification('Failed to save todo', 'error');
    }
  }, [editingTodo, addTodo, updateTodo, addNotification, handleCloseDialog]);

  const handleDeleteTodo = useCallback(async (id: string) => {
    try {
      await deleteTodo(id);
      setSnackbar({
        open: true,
        message: 'Todo deleted successfully!',
        severity: 'success',
      });
      addNotification('Todo deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting todo:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete todo. Please try again.',
        severity: 'error',
      });
      addNotification('Failed to delete todo', 'error');
    }
  }, [deleteTodo, addNotification]);

  const handleToggleComplete = useCallback(async (todo: Todo) => {
    try {
      await toggleComplete(todo);
    } catch (error) {
      console.error('Error toggling todo:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update todo. Please try again.',
        severity: 'error',
      });
    }
  }, [toggleComplete]);

  const handleSearch = useCallback(() => {
    // Search functionality is handled by the header
  }, []);

  const handleFilter = useCallback(() => {
    // Filter functionality is handled by TodoFilters component
  }, []);

  const handleMenuToggle = useCallback(() => {
    // Handle mobile menu toggle
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to logout. Please try again.',
        severity: 'error',
      });
    }
  }, [signOutUser, navigate]);

  const handleProfile = useCallback(() => {
    navigate('/account');
  }, [navigate]);

  const handleSettings = useCallback(() => {
    navigate('/account');
  }, [navigate]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Memoized filtered todos
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = !filters.search || 
        todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        todo.body.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesPriority = filters.priority === 'all' || todo.priority === filters.priority;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'completed' && todo.completed) ||
        (filters.status === 'pending' && !todo.completed);
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [todos, filters]);

  // Determine empty state type
  const getEmptyStateType = () => {
    if (todos.length === 0) return 'no-todos';
    if (filteredTodos.length === 0 && filters.search) return 'no-results';
    if (filteredTodos.length === 0 && filters.status === 'completed') return 'no-completed';
    if (filteredTodos.length === 0 && filters.status === 'pending') return 'no-pending';
    return 'no-todos';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            My Todos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your tasks and stay organized
          </Typography>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${stats.total} Total`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${stats.completed} Completed`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${stats.pending} Pending`}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            {stats.overdue > 0 && (
              <Chip
                label={`${stats.overdue} Overdue`}
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>

        {/* Filters */}
        <Slide direction="down" in timeout={300}>
          <Box sx={{ mb: 3 }}>
            <TodoFilters
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
              todoCount={filteredTodos.length}
            />
          </Box>
        </Slide>

        {/* Todo List */}
        <Box>
          {loading ? (
            <TodoSkeleton count={5} />
          ) : filteredTodos.length === 0 ? (
            <EmptyState
              type={getEmptyStateType()}
              onAction={getEmptyStateType() === 'no-todos' ? handleAddTodo : clearFilters}
              searchQuery={filters.search}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredTodos.map((todo, index) => (
                <Fade
                  key={todo.id || todo.todoId}
                  in
                  timeout={300 + index * 100}
                >
                  <Box>
                    <TodoCard
                      todo={todo}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTodo}
                      onDelete={(todo) => {
                        const todoId = todo.todoId || todo.id;
                        if (todoId) {
                          handleDeleteTodo(todoId);
                        }
                      }}
                      onMenuOpen={(event, todo) => {
                        // Handle menu open if needed
                      }}
                    />
                  </Box>
                </Fade>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {/* Floating Action Button */}
      <ModernFAB
        onAddTodo={handleAddTodo}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onEdit={() => handleAddTodo()}
      />

      {/* Todo Dialog */}
      <TodoDialog
        open={showAddDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitTodo}
        todo={editingTodo}
        loading={loading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            minWidth: 300,
            borderRadius: 2,
            boxShadow: `0 8px 24px ${alpha(theme.palette[snackbar.severity].main, 0.3)}`,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ModernTodoList;
