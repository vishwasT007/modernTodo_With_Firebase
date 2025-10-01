import React, { useState, useEffect } from 'react';
import {
  useTheme,
  useMediaQuery,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  Box,
  // ...existing code...
  Badge,
  Tooltip,
  Fade,
  Zoom,
  Chip,
  Stack,
  alpha,
  Button,
  Collapse,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  AccountCircle,
  Logout,
  LightMode,
  DarkMode,
  Notifications,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Settings,
  Help,
  Feedback,
  Star,
  TrendingUp,
  TaskAlt,
  Schedule,
  Warning,
  CheckCircle,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Security,
  Speed,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import NotificationSystem from './NotificationSystem';

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { 
    theme: appTheme, 
    toggleTheme, 
    setTheme,
    sidebarOpen, 
    mobileSidebarOpen,
    toggleSidebar,
    toggleMobileSidebar,
    setSidebarOpen,
    notifications,
  } = useApp();
  
  const { user, firebaseUser, firebaseStats, signOutUser } = useFirebase();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    navigation: true,
    account: true,
  });

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setSidebarOpen]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
      handleProfileMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
      handleProfileMenuClose();
    }
  };

  const handleThemeChange = (event) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard',
      description: 'Overview and analytics'
    },
    { 
      text: 'Todos', 
      icon: <Assignment />, 
      path: '/todos',
      description: 'Manage your tasks',
      badge: firebaseStats?.pending || 0
    },
    { 
      text: 'Account', 
      icon: <AccountCircle />, 
      path: '/account',
      description: 'Profile settings'
    },
  ];

  const quickStats = [
    {
      label: 'Total',
      value: firebaseStats?.total || 0,
      icon: <Assignment />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Completed',
      value: firebaseStats?.completed || 0,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
    },
    {
      label: 'Pending',
      value: firebaseStats?.pending || 0,
      icon: <Schedule />,
      color: theme.palette.warning.main,
    },
    {
      label: 'Overdue',
      value: firebaseStats?.overdue || 0,
      icon: <Warning />,
      color: theme.palette.error.main,
    },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <TaskAlt sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                TodoApp Pro
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Task Management
              </Typography>
            </Box>
          </Box>
          {!isMobile && (
            <Tooltip title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{ color: 'white' }}
                size="small"
              >
                {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{ 
              width: 48, 
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          {sidebarOpen && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, noWrap: true }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Quick Stats */}
      {sidebarOpen && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
            Quick Stats
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
            {quickStats.map((stat, index) => (
              <Fade in={true} timeout={600 + index * 100} key={stat.label}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    textAlign: 'center',
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={0.5}>
                    {React.cloneElement(stat.icon, { 
                      sx: { fontSize: 16, color: stat.color } 
                    })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Fade>
            ))}
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item, index) => (
            <Fade in={true} timeout={800 + index * 100} key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 0.5,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiListItemText-primary': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                    },
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.badge > 0 ? (
                      <Badge badgeContent={item.badge} color="error" max={99}>
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText 
                      primary={item.text}
                      secondary={item.description}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        color: 'text.secondary',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Fade>
          ))}
        </List>
      </Box>

      {/* Theme Toggle */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <FormControlLabel
          control={
            <Switch
              checked={appTheme === 'dark'}
              onChange={handleThemeChange}
              icon={<LightMode />}
              checkedIcon={<DarkMode />}
              color="primary"
            />
          }
          label={sidebarOpen ? (appTheme === 'dark' ? 'Dark Mode' : 'Light Mode') : ''}
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)` },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backdropFilter: 'blur(20px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'TodoApp Pro'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {menuItems.find(item => item.path === location.pathname)?.description || 'Task Management'}
            </Typography>
          </Box>
          
          {/* Right side actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Badge badgeContent={notifications.length} color="error" max={99}>
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Profile Menu */}
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
          
          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.email}
              </Typography>
            </Box>
            <MenuItem onClick={() => { navigate('/account'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/help'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <Help fontSize="small" />
              </ListItemIcon>
              <ListItemText>Help & Support</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ 
          width: { md: sidebarOpen ? drawerWidth : collapsedDrawerWidth }, 
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileSidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.background.default,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
      
      {/* Notification System */}
      <NotificationSystem />
    </Box>
  );
};

export default Layout;