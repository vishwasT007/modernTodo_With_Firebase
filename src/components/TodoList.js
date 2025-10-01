import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Paper,
  Divider,
  Container,
  Stack,
  Tooltip,
  Fade,
  Zoom,
  alpha,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
  Alert,
  Skeleton,
  Snackbar
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import {
  Star,
  TrendingUp,
  Warning,
  Refresh,
  DoneAll,
  Pending,
  Clear,
  Add,
  Edit,
  Delete,
  MoreVert,
  Search,
  FilterList,
  CheckCircle,
  RadioButtonUnchecked,
  CalendarToday,
  PriorityHigh,
  Sort,
  ViewList,
  ViewModule,
  AccessTime,
  Flag,
  AddTask,
  TaskAlt,
  Assignment
} from '@mui/icons-material';

// Configure dayjs plugins
dayjs.extend(relativeTime);

const TodoList = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { todos, loading, addTodo, updateTodo, deleteTodo } = useApp();
  const { firebaseTodos, firebaseStats } = useFirebase();
  
  // Use Firebase todos if available, fallback to local todos
  const currentTodos = firebaseTodos?.length > 0 ? firebaseTodos : todos;
  const currentStats = firebaseStats || { total: 0, completed: 0, pending: 0, overdue: 0 };
  
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [showCompleted, setShowCompleted] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    priority: 'medium',
    dueDate: null,
    completed: false,
  });

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Cleanup anchorEl on unmount
  useEffect(() => {
    return () => {
      setAnchorEl(null);
    };
  }, []);

  const handleOpen = (todo = null) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({
        title: todo.title,
        body: todo.body,
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate ? dayjs(todo.dueDate?.toDate ? todo.dueDate.toDate() : todo.dueDate) : null,
        completed: todo.completed || false,
      });
    } else {
      setEditingTodo(null);
      setFormData({
        title: '',
        body: '',
        priority: 'medium',
        dueDate: null,
        completed: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTodo(null);
    setFormData({
      title: '',
      body: '',
      priority: 'medium',
      dueDate: null,
      completed: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const todoData = {
      ...formData,
      dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
    };

    try {
      if (editingTodo) {
        await updateTodo(editingTodo.todoId || editingTodo.id, todoData);
      } else {
        await addTodo(todoData);
      }
      handleClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving todo', severity: 'error' });
      console.error('Error saving todo:', error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setSnackbar({ open: true, message: 'Todo deleted successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting todo', severity: 'error' });
      console.error('Error deleting todo:', error);
    }
    setAnchorEl(null);
  };

  const handleToggleComplete = async (todo) => {
    try {
      const todoId = todo.todoId || todo.id;
      await updateTodo(todoId, { completed: !todo.completed });
      setSnackbar({ open: true, message: 'Todo status updated!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating todo', severity: 'error' });
      console.error('Error updating todo:', error);
    }
  };

  const handleMenuOpen = (event, todo) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Opening menu for todo:', todo);
    console.log('Anchor element:', event.currentTarget);
    
    // Ensure the anchor element is valid
    if (event.currentTarget && event.currentTarget instanceof Element) {
      setAnchorEl(event.currentTarget);
      setSelectedTodo(todo);
    } else {
      console.error('Invalid anchor element:', event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTodo(null);
  };


  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <PriorityHigh fontSize="small" />;
    if (priority === 'medium') return <Flag fontSize="small" />;
    if (priority === 'low') return <Star fontSize="small" />;
    return null;
  };

  const getPriorityGradient = (priority) => {
    switch (priority) {
      case 'high': return 'linear-gradient(135deg, #F44336 0%, #E57373 100%)';
      case 'medium': return 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)';
      case 'low': return 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)';
      default: return 'linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%)';
    }
  };

  const filteredTodos = currentTodos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           todo.body.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'completed' && todo.completed) ||
                           (filterStatus === 'pending' && !todo.completed);
      const matchesCompleted = showCompleted || !todo.completed;
      return matchesSearch && matchesFilter && matchesCompleted;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const StatCard = ({ title, value, color, icon, trend, delay = 0 }) => (
    <Zoom in={fadeIn} timeout={600 + delay}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px ${alpha(color, 0.2)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 0.5 }}>
                {value}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TrendingUp sx={{ fontSize: 16, color: '#4CAF50' }} />
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${alpha(color, 0.3)}`,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  const TodoCard = ({ todo, index }) => (
    <Fade in={fadeIn} timeout={800 + index * 100}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: todo.completed 
            ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
          border: `1px solid ${todo.completed ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: todo.completed ? 0.8 : 1,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
            '& .todo-actions': {
              opacity: 1,
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: getPriorityGradient(todo.priority),
          },
        }}
      >
        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="flex-start" gap={1.5} sx={{ flex: 1 }}>
              <Tooltip title={todo.completed ? 'Mark as pending' : 'Mark as completed'}>
                <IconButton
                  onClick={() => handleToggleComplete(todo)}
                  size="small"
                  sx={{
                    mt: -0.5,
                    color: todo.completed ? theme.palette.success.main : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {todo.completed ? (
                    <CheckCircle sx={{ fontSize: 24 }} />
                  ) : (
                    <RadioButtonUnchecked sx={{ fontSize: 24 }} />
                  )}
                </IconButton>
              </Tooltip>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.secondary' : 'text.primary',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {todo.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                  }}
                >
                  {todo.body}
                </Typography>
              </Box>
            </Box>
            <Box
              className="todo-actions"
              sx={{
                opacity: 0,
                transition: 'opacity 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Tooltip title="More options">
                <IconButton
                  onClick={(e) => handleMenuOpen(e, todo)}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              label={todo.priority}
              size="small"
              icon={getPriorityIcon(todo.priority)}
              sx={{
                background: getPriorityGradient(todo.priority),
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
            {todo.dueDate && (
              <Chip
                label={dayjs(todo.dueDate?.toDate ? todo.dueDate.toDate() : todo.dueDate).format('MMM DD')}
                size="small"
                icon={<CalendarToday />}
                color={dayjs(todo.dueDate?.toDate ? todo.dueDate.toDate() : todo.dueDate).isBefore(dayjs()) ? 'error' : 'default'}
                sx={{ fontWeight: 600 }}
              />
            )}
            {todo.completed && (
              <Chip
                label="Completed"
                size="small"
                icon={<TaskAlt />}
                color="success"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 14 }} />
              {dayjs(todo.createdAt?.toDate ? todo.createdAt.toDate() : todo.createdAt).fromNow()}
            </Typography>
            {todo.dueDate && dayjs(todo.dueDate?.toDate ? todo.dueDate.toDate() : todo.dueDate).isBefore(dayjs()) && !todo.completed && (
              <Chip
                label="Overdue"
                size="small"
                color="error"
                icon={<Warning />}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={60} />
          <Skeleton variant="text" width={400} height={30} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Fade in={fadeIn} timeout={800}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
              <Box>
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  My Todos 📝
                </Typography>
                <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
                  Stay organized and productive
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpen()}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  New Todo
                </Button>
              </Stack>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  title="Total"
                  value={currentStats.total || currentTodos.length}
                  color="#667eea"
                  icon={<Assignment sx={{ color: 'white', fontSize: 24 }} />}
                  delay={0}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  title="Completed"
                  value={currentStats.completed || currentTodos.filter(t => t.completed).length}
                  color="#4CAF50"
                  icon={<DoneAll sx={{ color: 'white', fontSize: 24 }} />}
                  delay={100}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  title="Pending"
                  value={currentStats.pending || currentTodos.filter(t => !t.completed).length}
                  color="#FF9800"
                  icon={<Pending sx={{ color: 'white', fontSize: 24 }} />}
                  delay={200}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <StatCard
                  title="Overdue"
                  value={currentStats.overdue || currentTodos.filter(t => 
                    t.dueDate && dayjs(t.dueDate).isBefore(dayjs()) && !t.completed
                  ).length}
                  color="#F44336"
                  icon={<Warning sx={{ color: 'white', fontSize: 24 }} />}
                  delay={300}
                />
              </Grid>
            </Grid>

            {/* Filters and Search */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSearchTerm('')}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterList />
                        </InputAdornment>
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">All Todos</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <Sort />
                        </InputAdornment>
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="createdAt">Date Created</MenuItem>
                      <MenuItem value="dueDate">Due Date</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                      <MenuItem value="priority">Priority</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show Completed"
                    sx={{ ml: 1 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Grid View">
                      <IconButton
                        onClick={() => setViewMode('grid')}
                        color={viewMode === 'grid' ? 'primary' : 'default'}
                      >
                        <ViewModule />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="List View">
                      <IconButton
                        onClick={() => setViewMode('list')}
                        color={viewMode === 'list' ? 'primary' : 'default'}
                      >
                        <ViewList />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Todo List */}
          {filteredTodos.length === 0 ? (
            <Zoom in={fadeIn} timeout={1000}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 8,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <AddTask sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {searchTerm || filterStatus !== 'all' 
                      ? 'No todos match your filters' 
                      : 'No todos yet. Create your first one!'}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Start organizing your tasks and boost your productivity'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    Create Your First Todo
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          ) : (
            <Grid container spacing={3}>
              {filteredTodos.map((todo, index) => (
                <Grid 
                  size={{ 
                    xs: 12, 
                    sm: viewMode === 'list' ? 12 : 6, 
                    md: viewMode === 'list' ? 12 : 4 
                  }}
                  key={todo.todoId || todo.id || index}
                >
                  <TodoCard todo={todo} index={index} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Floating Action Button */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleOpen()}
          >
            <Add />
          </Fab>

          {/* Todo Form Dialog */}
          <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
                backdropFilter: 'blur(20px)',
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AddTask sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {editingTodo ? 'Edit Todo' : 'Create New Todo'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {editingTodo ? 'Update your task details' : 'Add a new task to your list'}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="low">Low Priority</MenuItem>
                        <MenuItem value="medium">Medium Priority</MenuItem>
                        <MenuItem value="high">High Priority</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DatePicker
                      label="Due Date"
                      value={formData.dueDate}
                      onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                {editingTodo && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.completed}
                        onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Mark as completed"
                    sx={{ mt: 2 }}
                  />
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                  onClick={handleClose}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  {editingTodo ? 'Update Todo' : 'Create Todo'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Context Menu */}
          {anchorEl && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  minWidth: 160,
                  mt: 1,
                },
              }}
            >
            <MenuItem onClick={() => { handleOpen(selectedTodo); handleMenuClose(); }}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleDelete(selectedTodo?.todoId || selectedTodo?.id); handleMenuClose(); }}>
              <ListItemIcon>
                <Delete fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
            </Menu>
          )}

          {/* Snackbar for notifications */}
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Fade>
    </LocalizationProvider>
  );
};

export default TodoList;