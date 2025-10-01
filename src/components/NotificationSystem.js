import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  Fade,
  Box,
  Typography,
  Collapse,
  Paper,
  // ...existing code...
  Badge,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
  Notifications,
  NotificationsActive,
  ClearAll,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

// Slide transition for notifications
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// Individual notification component
const NotificationItem = ({ notification, onClose, onRemove }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const getSeverity = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return 'Notification';
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Paper
        elevation={2}
        sx={{
          mb: 1,
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette[getSeverity(notification.type)].main, 0.2)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette[getSeverity(notification.type)].main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        }}
      >
        <Alert
          severity={getSeverity(notification.type)}
          icon={getIcon(notification.type)}
          action={
            <Box display="flex" alignItems="center" gap={0.5}>
              {notification.message.length > 100 && (
                <Tooltip title={expanded ? 'Show less' : 'Show more'}>
                  <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    sx={{ color: 'inherit' }}
                  >
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  onClick={() => onClose(notification.id)}
                  sx={{ color: 'inherit' }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          sx={{
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
            {getTitle(notification.type)}
          </AlertTitle>
          <Typography
            variant="body2"
            sx={{
              display: expanded ? 'block' : '-webkit-box',
              WebkitLineClamp: expanded ? 'none' : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {notification.message}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {new Date(notification.timestamp).toLocaleTimeString()}
          </Typography>
        </Alert>
      </Paper>
    </Fade>
  );
};

// Notification center component
const NotificationCenter = ({ open, onClose, notifications, onRemove, onClearAll }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const type = notification.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(notification);
    return acc;
  }, {});

  const getTypeCount = (type) => {
    return notifications.filter(n => n.type === type).length;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      case 'warning': return theme.palette.warning.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        top: 64,
        right: 16,
        width: 360,
        maxHeight: '80vh',
        zIndex: 1300,
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.palette.divider}`,
        display: open ? 'block' : 'none',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsActive />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <Badge badgeContent={notifications.length} color="error" max={99} />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {notifications.length > 0 && (
              <Tooltip title="Clear all">
                <IconButton
                  size="small"
                  onClick={onClearAll}
                  sx={{ color: 'white' }}
                >
                  <ClearAll />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={onClose}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 1 }}>
            {Object.entries(groupedNotifications).map(([type, typeNotifications]) => (
              <Box key={type} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(getTypeColor(type), 0.1),
                    },
                  }}
                  onClick={() => setExpanded(!expanded)}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getTypeColor(type),
                      }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {type} ({getTypeCount(type)})
                    </Typography>
                  </Box>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Collapse in={expanded}>
                  <Box sx={{ pl: 2 }}>
                    {typeNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={onRemove}
                      />
                    ))}
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

// Main notification system component
const NotificationSystem = () => {
  const { notifications, removeNotification, clearAllNotifications } = useApp();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Auto-show snackbar for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setCurrentNotification(latestNotification);
      setSnackbarOpen(true);
    }
  }, [notifications]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleNotificationClose = (notificationId) => {
    removeNotification(notificationId);
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleNotificationCenterToggle = () => {
    setOpen(!open);
  };

  const handleNotificationCenterClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Snackbar for latest notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 2, mr: 2 }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={currentNotification?.type || 'info'}
          sx={{ width: '100%', minWidth: 300 }}
        >
          {currentNotification?.message}
        </Alert>
      </Snackbar>

      {/* Notification Center */}
      <NotificationCenter
        open={open}
        onClose={handleNotificationCenterClose}
        notifications={notifications}
        onRemove={handleNotificationClose}
        onClearAll={handleClearAll}
      />
    </>
  );
};

export default NotificationSystem;