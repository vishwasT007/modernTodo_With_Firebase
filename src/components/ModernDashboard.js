import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  useTheme,
  Paper,
  IconButton,
  Fade,
  Zoom,
  Container,
  Button,
  Stack,
  alpha,
  useMediaQuery,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Add,
  Refresh,
  Analytics,
  Speed,
  EmojiEvents,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import dayjs from 'dayjs';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ModernDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { stats, todos, user, loading: appLoading } = useApp();
  const { firebaseStats, firebaseTodos, loading: firebaseLoading, refreshUserData } = useFirebase();
  const [fadeIn, setFadeIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Always prefer Firebase data if available (check if firebaseTodos is defined, even if empty)
  const currentStats = firebaseTodos !== undefined ? firebaseStats : stats;
  const currentTodos = firebaseTodos !== undefined ? firebaseTodos : todos;
  const loading = firebaseLoading && firebaseTodos === undefined; // Only show loading if Firebase is loading and no todos yet

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Calculate previous week's stats for trends
  const calculateTrends = useMemo(() => {
    const lastWeekTodos = currentTodos.filter(todo => {
      const createdDate = todo.createdAt ? dayjs(todo.createdAt) : null;
      return createdDate && createdDate.isAfter(dayjs().subtract(7, 'days'));
    });

    const thisWeekCompleted = lastWeekTodos.filter(todo => todo.completed).length;
    const totalChange = lastWeekTodos.length > 0 ? ((lastWeekTodos.length / Math.max(currentTodos.length, 1)) * 100).toFixed(0) : 0;
    const completedChange = thisWeekCompleted > 0 ? ((thisWeekCompleted / Math.max(currentStats.completed || 0, 1)) * 100).toFixed(0) : 0;
    
    return {
      total: totalChange,
      completed: completedChange,
      pending: currentStats.pending || 0,
      overdue: currentStats.overdue || 0,
    };
  }, [currentTodos, currentStats]);

  // Calculate weekly activity (real data)
  const weeklyActivity = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todosPerDay = Array(7).fill(0);
    
    currentTodos.forEach(todo => {
      if (todo.createdAt) {
        const todoDate = dayjs(todo.createdAt);
        const dayOfWeek = todoDate.day(); // 0 = Sunday, 1 = Monday, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon = 0
        if (todoDate.isAfter(dayjs().subtract(7, 'days'))) {
          todosPerDay[adjustedDay]++;
        }
      }
    });

    return {
      labels: days,
      data: todosPerDay,
    };
  }, [currentTodos]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUserData?.();
      setTimeout(() => setRefreshing(false), 1000);
    } catch (error) {
      console.error('Refresh error:', error);
      setRefreshing(false);
    }
  }, [refreshUserData]);

  // Handle new todo navigation
  const handleNewTodo = useCallback(() => {
    navigate('/todos');
  }, [navigate]);

  // Prepare data for charts
  const completionData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [
          currentStats.completed || 0,
          currentStats.pending || 0,
          currentStats.overdue || 0,
        ],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const weeklyData = {
    labels: weeklyActivity.labels,
    datasets: [
      {
        label: 'Todos Created',
        data: weeklyActivity.data,
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.9) : alpha('#fff', 0.9),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: alpha(theme.palette.divider, 0.2),
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
        ticks: {
          color: theme.palette.text.secondary,
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.9) : alpha('#fff', 0.9),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: alpha(theme.palette.divider, 0.2),
        borderWidth: 1,
        padding: 12,
      },
    },
    cutout: '70%',
  };

  const StatCard = ({ title, value, color, icon, trend, trendDirection, delay = 0 }) => (
    <Zoom in={fadeIn} timeout={600 + delay}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
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
        onClick={() => navigate('/todos')}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
                sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                {title}
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {loading ? <Skeleton width={60} /> : value}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  {trendDirection === 'up' ? (
                    <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />
                  )}
                  <Typography
                    variant="body2"
                    color={trendDirection === 'up' ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 600 }}
                  >
                    {trend}% this week
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                width: 60,
                height: 60,
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

  const completionRate = (currentStats.total || 0) > 0 
    ? Math.round(((currentStats.completed || 0) / (currentStats.total || 1)) * 100) 
    : 0;

  const recentTodos = currentTodos.slice(0, 5);

  return (
    <Fade in={fadeIn} timeout={800}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome back{user?.displayName ? `, ${user.displayName}` : ''}! 👋
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
                Here's your productivity overview for today
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleNewTodo}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                New Todo
              </Button>
            </Stack>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Todos"
              value={currentStats.total || 0}
              color={theme.palette.primary.main}
              icon={<Assignment sx={{ color: 'white', fontSize: 28 }} />}
              trend={calculateTrends.total}
              trendDirection="up"
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Completed"
              value={currentStats.completed || 0}
              color={theme.palette.success.main}
              icon={<CheckCircle sx={{ color: 'white', fontSize: 28 }} />}
              trend={calculateTrends.completed}
              trendDirection="up"
              delay={100}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Pending"
              value={currentStats.pending || 0}
              color={theme.palette.warning.main}
              icon={<Schedule sx={{ color: 'white', fontSize: 28 }} />}
              trend={calculateTrends.pending}
              trendDirection="down"
              delay={200}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Overdue"
              value={currentStats.overdue || 0}
              color={theme.palette.error.main}
              icon={<Warning sx={{ color: 'white', fontSize: 28 }} />}
              trend={calculateTrends.overdue}
              trendDirection="down"
              delay={300}
            />
          </Grid>

          {/* Completion Rate Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Zoom in={fadeIn} timeout={800}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    >
                      <Analytics sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Completion Rate
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Your productivity score
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {loading ? <Skeleton width={80} /> : `${completionRate}%`}
                      </Typography>
                      <Chip
                        label={completionRate >= 80 ? "Excellent" : completionRate >= 60 ? "Good" : completionRate >= 40 ? "Fair" : "Keep Going"}
                        color={completionRate >= 80 ? "success" : completionRate >= 60 ? "info" : completionRate >= 40 ? "warning" : "error"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={completionRate}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        background: alpha(theme.palette.divider, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        },
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary">
                    {currentStats.completed || 0} of {currentStats.total || 0} todos completed
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Zoom in={fadeIn} timeout={1000}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                        }}
                      >
                        <Speed sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Recent Activity
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Latest todo updates
                        </Typography>
                      </Box>
                    </Box>
                    {recentTodos.length > 0 && (
                      <IconButton size="small" onClick={() => navigate('/todos')}>
                        <ArrowForward />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 250, overflowY: 'auto' }}>
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                      ))
                    ) : recentTodos.length > 0 ? (
                      recentTodos.map((todo, index) => (
                        <Fade in={fadeIn} timeout={1200 + index * 100} key={todo.todoId || todo.id || index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: alpha(theme.palette.background.paper, 0.7),
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                background: alpha(theme.palette.background.paper, 1),
                                transform: 'translateX(4px)',
                                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                              },
                            }}
                            onClick={() => navigate('/todos')}
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mb: 0.5,
                                  }}
                                >
                                  {todo.title}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {(() => {
                                    try {
                                      if (!todo.dueDate) return 'No due date';
                                      const date = todo.dueDate?.toDate ? todo.dueDate.toDate() : todo.dueDate;
                                      const dueDateObj = dayjs(date);
                                      if (!dueDateObj.isValid()) return 'No due date';
                                      return `Due ${dueDateObj.format('MMM D, YYYY')}`;
                                    } catch (error) {
                                      return 'No due date';
                                    }
                                  })()}
                                </Typography>
                              </Box>
                              <Chip
                                label={todo.completed ? 'Done' : todo.priority || 'Medium'}
                                size="small"
                                color={todo.completed ? 'success' : todo.priority === 'high' ? 'error' : todo.priority === 'low' ? 'info' : 'warning'}
                                variant="outlined"
                                sx={{ fontWeight: 600, ml: 2 }}
                              />
                            </Box>
                          </Paper>
                        </Fade>
                      ))
                    ) : (
                      <Box textAlign="center" py={4}>
                        <EmojiEvents sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          No todos yet. Create your first one!
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Add />}
                          onClick={handleNewTodo}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Create Todo
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Charts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Zoom in={fadeIn} timeout={1200}>
              <Card
                sx={{
                  height: 400,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                      }}
                    >
                      <Analytics sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Todo Distribution
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Visual breakdown of your tasks
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 280 }}>
                    {loading ? (
                      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Doughnut data={completionData} options={doughnutOptions} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Zoom in={fadeIn} timeout={1400}>
              <Card
                sx={{
                  height: 400,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                      }}
                    >
                      <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Weekly Activity
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Your productivity over time
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 280 }}>
                    {loading ? (
                      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Bar data={weeklyData} options={chartOptions} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};

export default ModernDashboard;

