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
  Switch,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  Box,
  Badge,
  Tooltip,
  Fade,
  Chip,
  Stack,
  alpha,
  Button,
  Popover,
  Paper,
  ListItemText as MuiListItemText,
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
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
  Settings,
  Close,
  ClearAll,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import NotificationSystem from './NotificationSystem';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

const ModernLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { 
    theme: appTheme, 
    setTheme,
    sidebarOpen, 
    toggleSidebar,
    setSidebarOpen,
    notifications,
    removeNotification,
    clearAllNotifications,
  } = useApp();
  
  const { user, firebaseUser, firebaseStats, signOutUser } = useFirebase();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setSidebarOpen]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      toggleSidebar();
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
      handleProfileMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleThemeToggle = () => {
    setTheme(appTheme === 'dark' ? 'light' : 'dark');
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationItemClose = (id) => {
    removeNotification(id);
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
    handleNotificationClose();
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard',
      color: theme.palette.primary.main,
    },
    { 
      text: 'My Todos', 
      icon: <Assignment />, 
      path: '/todos',
      color: theme.palette.secondary.main,
      badge: firebaseStats?.pending || 0
    },
    { 
      text: 'Account', 
      icon: <AccountCircle />, 
      path: '/account',
      color: theme.palette.info.main,
    },
  ];

  const isActivePath = (path) => location.pathname === path;

  // Sidebar Content
  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`
          : `linear-gradient(180deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha('#f8f9fa', 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: sidebarOpen ? 3 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {sidebarOpen ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Assignment sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                TodoApp
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Stay Organized
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Assignment sx={{ color: 'white', fontSize: 24 }} />
          </Box>
        )}
      </Box>

      {/* User Profile Section */}
      {sidebarOpen && (
        <Fade in={sidebarOpen} timeout={300}>
          <Box
            sx={{
              p: 3,
              pb: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={user?.photoURL}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.displayName || 'User'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              {/* Quick Stats */}
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label={firebaseStats?.completed || 0}
                  size="small"
                  sx={{
                    flex: 1,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
                <Chip
                  icon={<Schedule sx={{ fontSize: 16 }} />}
                  label={firebaseStats?.pending || 0}
                  size="small"
                  sx={{
                    flex: 1,
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: 1.5, py: 2 }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip
                  title={!sidebarOpen ? item.text : ''}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: sidebarOpen ? 2 : 2.5,
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      background: active
                        ? `linear-gradient(135deg, ${alpha(item.color, 0.15)} 0%, ${alpha(item.color, 0.08)} 100%)`
                        : 'transparent',
                      border: active
                        ? `1px solid ${alpha(item.color, 0.3)}`
                        : `1px solid transparent`,
                      color: active ? item.color : theme.palette.text.primary,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: active
                          ? `linear-gradient(135deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.12)} 100%)`
                          : alpha(theme.palette.action.hover, 0.08),
                        transform: 'translateX(4px)',
                        boxShadow: active
                          ? `0 4px 12px ${alpha(item.color, 0.2)}`
                          : 'none',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarOpen ? 40 : 'auto',
                        color: 'inherit',
                        justifyContent: 'center',
                      }}
                    >
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        invisible={!item.badge || item.badge === 0}
                      >
                        {React.cloneElement(item.icon, {
                          sx: {
                            fontSize: 24,
                            transition: 'all 0.3s ease',
                            ...(active && {
                              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                            }),
                          },
                        })}
                      </Badge>
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: active ? 700 : 600,
                          fontSize: '0.95rem',
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Actions */}
      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          p: 2,
        }}
      >
        {/* Theme Toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center',
            p: 1.5,
            borderRadius: 2,
            background: alpha(theme.palette.action.hover, 0.05),
            mb: 1,
            transition: 'all 0.3s ease',
          }}
        >
          {sidebarOpen ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {appTheme === 'dark' ? (
                  <DarkMode sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                ) : (
                  <LightMode sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                )}
                <Typography variant="body2" fontWeight={600}>
                  {appTheme === 'dark' ? 'Dark' : 'Light'} Mode
                </Typography>
              </Box>
              <Switch
                checked={appTheme === 'dark'}
                onChange={handleThemeToggle}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              />
            </>
          ) : (
            <IconButton onClick={handleThemeToggle} size="small">
              {appTheme === 'dark' ? (
                <DarkMode sx={{ fontSize: 20 }} />
              ) : (
                <LightMode sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          )}
        </Box>

        {/* Collapse Button */}
        {!isMobile && (
          <Button
            fullWidth
            onClick={handleDrawerToggle}
            variant="outlined"
            sx={{
              borderRadius: 2,
              py: 1,
              borderColor: alpha(theme.palette.divider, 0.2),
              color: theme.palette.text.secondary,
              justifyContent: 'center',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ChevronLeft
              sx={{
                fontSize: 20,
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
            {sidebarOpen && (
              <Typography variant="body2" fontWeight={600} sx={{ ml: 1 }}>
                Collapse
              </Typography>
            )}
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)`,
          ml: isMobile ? 0 : `${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px`,
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha('#ffffff', 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                mr: 1,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Badge badgeContent={notifications?.length || 0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Avatar
                src={user?.photoURL}
                sx={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
              },
            }}
          >
            <MenuItem onClick={() => { navigate('/account'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Account</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/account'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notification Popover */}
          <Popover
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
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
                mt: 1.5,
                width: 360,
                maxHeight: 480,
                borderRadius: 2,
                boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
                overflow: 'hidden',
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700}>
                  Notifications
                </Typography>
                {notifications?.length > 0 && (
                  <Button
                    size="small"
                    startIcon={<ClearAll />}
                    onClick={handleClearAllNotifications}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>
            </Box>

            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications?.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {notifications?.map((notification, index) => {
                    const getIcon = () => {
                      switch (notification.type) {
                        case 'success':
                          return <CheckCircle sx={{ color: theme.palette.success.main }} />;
                        case 'error':
                          return <Error sx={{ color: theme.palette.error.main }} />;
                        case 'warning':
                          return <Warning sx={{ color: theme.palette.warning.main }} />;
                        default:
                          return <Info sx={{ color: theme.palette.info.main }} />;
                      }
                    };

                    const getColor = () => {
                      switch (notification.type) {
                        case 'success':
                          return theme.palette.success.main;
                        case 'error':
                          return theme.palette.error.main;
                        case 'warning':
                          return theme.palette.warning.main;
                        default:
                          return theme.palette.info.main;
                      }
                    };

                    return (
                      <React.Fragment key={notification.id}>
                        <ListItem
                          sx={{
                            py: 2,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.action.hover, 0.05),
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getIcon()}
                          </ListItemIcon>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {notification.message}
                            </Typography>
                            {notification.timestamp && (
                              <Typography variant="caption" color="text.secondary">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleNotificationItemClose(notification.id)}
                            sx={{ ml: 1 }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </ListItem>
                        {index < notifications.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: theme.palette.mode === 'dark'
              ? `4px 0 24px ${alpha(theme.palette.common.black, 0.3)}`
              : `4px 0 24px ${alpha(theme.palette.common.black, 0.08)}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)`,
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`
            : `linear-gradient(180deg, ${alpha('#f8f9fa', 0.5)} 0%, ${alpha('#ffffff', 0.8)} 100%)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>

      {/* Notification System */}
      <NotificationSystem />
    </Box>
  );
};

export default ModernLayout;

