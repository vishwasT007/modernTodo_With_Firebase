import React, { memo, useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Slide,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Menu as MenuIcon,
  Close,
  CheckCircle,
  Schedule,
  PriorityHigh,
} from '@mui/icons-material';
import { TodoStats } from '../types';

interface ModernHeaderProps {
  onAddTodo: () => void;
  onSearch: (query: string) => void;
  onFilter: () => void;
  onMenuToggle: () => void;
  stats: TodoStats;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user?: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  };
  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = memo(({
  onAddTodo,
  onSearch,
  onFilter,
  onMenuToggle,
  stats,
  searchQuery,
  onSearchChange,
  user,
  onLogout,
  onProfile,
  onSettings,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleProfileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setShowSearch(!showSearch);
    if (showSearch) {
      onSearchChange('');
    }
  }, [showSearch, onSearchChange]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  }, [onSearchChange]);

  const StatChip = memo(({ icon, label, value, color }: {
    icon: React.ReactElement;
    label: string;
    value: number;
    color: string;
  }) => (
    <Chip
      icon={icon}
      label={`${value} ${label}`}
      size="small"
      sx={{
        backgroundColor: alpha(color, 0.1),
        color: color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 28,
        '& .MuiChip-icon': {
          fontSize: '0.875rem',
        },
      }}
    />
  ));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
        {/* Left side - Logo and Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuToggle}
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              mr: 1,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TodoApp
          </Typography>
        </Box>

        {/* Center - Search (desktop) */}
        {!isMobile && (
          <Box sx={{ flex: 1, maxWidth: 400, mx: 3 }}>
            <Box
              sx={{
                position: 'relative',
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                borderRadius: 25,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Box
                component="input"
                placeholder="Search todos..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  fontSize: '0.875rem',
                  '&::placeholder': {
                    color: alpha(theme.palette.common.white, 0.7),
                  },
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                }}
              >
                <Search fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Right side - Stats, Actions, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {/* Stats - Desktop only */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <StatChip
                icon={<CheckCircle fontSize="small" />}
                label="Done"
                value={stats.completed}
                color={theme.palette.success.main}
              />
              <StatChip
                icon={<Schedule fontSize="small" />}
                label="Pending"
                value={stats.pending}
                color={theme.palette.warning.main}
              />
              <StatChip
                icon={<PriorityHigh fontSize="small" />}
                label="High"
                value={stats.highPriority}
                color={theme.palette.error.main}
              />
            </Box>
          )}

          {/* Mobile search toggle */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleSearchToggle}
              sx={{ mr: 1 }}
            >
              <Search />
            </IconButton>
          )}

          {/* Filter button */}
          <IconButton
            color="inherit"
            onClick={onFilter}
            sx={{ mr: 1 }}
          >
            <FilterList />
          </IconButton>

          {/* Add todo button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddTodo}
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              color: 'white',
              fontWeight: 600,
              borderRadius: 20,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.3),
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isMobile ? <Add /> : 'Add Todo'}
          </Button>

          {/* Profile menu */}
          <IconButton
            size="large"
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar
              src={user?.photoURL}
              sx={{
                width: 32,
                height: 32,
                border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
              }}
            >
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </Avatar>
          </IconButton>

          {/* Profile menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
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
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.displayName || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { onProfile(); handleProfileMenuClose(); }}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { onSettings(); handleProfileMenuClose(); }}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { onLogout(); handleProfileMenuClose(); }}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile search bar */}
      <Slide direction="down" in={showSearch} mountOnEnter unmountOnExit>
        <Box
          sx={{
            px: 2,
            pb: 2,
            backgroundColor: alpha(theme.palette.primary.dark, 0.8),
          }}
        >
          <Box
            sx={{
              position: 'relative',
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              borderRadius: 25,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Box
              component="input"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'white',
                px: 3,
                py: 1.5,
                fontSize: '0.875rem',
                '&::placeholder': {
                  color: alpha(theme.palette.common.white, 0.7),
                },
              }}
            />
            <IconButton
              size="small"
              onClick={handleSearchToggle}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Slide>
    </AppBar>
  );
});

ModernHeader.displayName = 'ModernHeader';

export default ModernHeader;
