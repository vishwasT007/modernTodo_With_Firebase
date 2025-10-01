import React, { useState, useEffect } from 'react';
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
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Add,
  MoreVert,
  Refresh,
  Analytics,
  Speed,
  EmojiEvents,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';

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

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { stats, todos, user } = useApp();
  const { firebaseStats, firebaseTodos } = useFirebase();
  const [fadeIn, setFadeIn] = useState(false);

  // Use Firebase stats if available, fallback to local stats
  const currentStats = firebaseStats?.total > 0 ? firebaseStats : stats;
  const currentTodos = firebaseTodos?.length > 0 ? firebaseTodos : todos;

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Prepare data for charts
  const completionData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [
          currentStats.completedTodos || currentStats.completed || 0,
          currentStats.pendingTodos || currentStats.pending || 0,
          currentStats.overdueTodos || currentStats.overdue || 0,
        ],
        backgroundColor: [
          '#4CAF50',
          '#FF9800',
          '#F44336',
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Todos Created',
        data: [12, 19, 3, 5, 2, 3, 8],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
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
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
        },
      },
      x: {
        grid: {
          display: false,
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
        },
      },
    },
    cutout: '70%',
  };

  const StatCard = ({ title, value, subtitle, color, icon, trend, delay = 0 }) => (
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
                {value}
              </Typography>
              {subtitle && (
                <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                  {subtitle}
                </Typography>
              )}
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

  const completionRate = (currentStats.totalTodos || currentStats.total || 0) > 0 
    ? Math.round(((currentStats.completedTodos || currentStats.completed || 0) / (currentStats.totalTodos || currentStats.total || 1)) * 100) 
    : 0;

  const recentTodos = currentTodos.slice(0, 5);

  return (
    <Fade in={fadeIn} timeout={800}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
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
                Welcome back, {user?.firstName || 'User'}! 👋
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
                Here's your productivity overview for today
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
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
        </Box>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Todos"
              value={currentStats.totalTodos || currentStats.total || 0}
              color="#667eea"
              icon={<Assignment sx={{ color: 'white', fontSize: 28 }} />}
              trend="+12%"
              delay={0}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Completed"
              value={currentStats.completedTodos || currentStats.completed || 0}
              color="#4CAF50"
              icon={<CheckCircle sx={{ color: 'white', fontSize: 28 }} />}
              trend="+8%"
              delay={100}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Pending"
              value={currentStats.pendingTodos || currentStats.pending || 0}
              color="#FF9800"
              icon={<Schedule sx={{ color: 'white', fontSize: 28 }} />}
              trend="-5%"
              delay={200}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Overdue"
              value={currentStats.overdueTodos || currentStats.overdue || 0}
              color="#F44336"
              icon={<Warning sx={{ color: 'white', fontSize: 28 }} />}
              trend="-15%"
              delay={300}
            />
          </Grid>

          {/* Completion Rate Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Zoom in={fadeIn} timeout={800}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Analytics sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Completion Rate
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Your productivity score
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {completionRate}%
                      </Typography>
                      <Chip
                        label={completionRate >= 80 ? "Excellent" : completionRate >= 60 ? "Good" : "Needs Improvement"}
                        color={completionRate >= 80 ? "success" : completionRate >= 60 ? "warning" : "error"}
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
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        },
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary">
                    {currentStats.completedTodos || currentStats.completed || 0} of {currentStats.totalTodos || currentStats.total || 0} todos completed
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
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
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
                          background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Speed sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Recent Activity
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Latest todo updates
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentTodos.length > 0 ? (
                      recentTodos.map((todo, index) => (
                        <Fade in={fadeIn} timeout={1200 + index * 100} key={todo.todoId || index}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: alpha(theme.palette.background.paper, 0.7),
                              border: '1px solid rgba(0,0,0,0.05)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: alpha(theme.palette.background.paper, 1),
                                transform: 'translateX(4px)',
                              },
                            }}
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {todo.title}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}
                                </Typography>
                              </Box>
                              <Chip
                                label={todo.completed ? 'Completed' : 'Pending'}
                                size="small"
                                color={todo.completed ? 'success' : 'warning'}
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                          </Paper>
                        </Fade>
                      ))
                    ) : (
                      <Box textAlign="center" py={4}>
                        <EmojiEvents sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" color="textSecondary">
                          No todos yet. Create your first one!
                        </Typography>
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
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
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
                        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Analytics sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Todo Distribution
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Visual breakdown of your tasks
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 280 }}>
                    <Doughnut data={completionData} options={doughnutOptions} />
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
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)',
                  border: '1px solid rgba(156, 39, 176, 0.2)',
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
                        background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Weekly Activity
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Your productivity over time
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 280 }}>
                    <Bar data={weeklyData} options={chartOptions} />
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

export default Dashboard;