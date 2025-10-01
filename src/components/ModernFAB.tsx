import React, { memo, useState, useCallback } from 'react';
import {
  Fab,
  Tooltip,
  Zoom,
  useTheme,
  alpha,
  Box,
} from '@mui/material';
import {
  Add,
  Close,
  Edit,
  FilterList,
  Search,
} from '@mui/icons-material';

interface ModernFABProps {
  onAddTodo: () => void;
  onSearch: () => void;
  onFilter: () => void;
  onEdit: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const ModernFAB: React.FC<ModernFABProps> = memo(({
  onAddTodo,
  onSearch,
  onFilter,
  onEdit,
  isExpanded = false,
  onToggle,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setExpanded(!expanded);
    onToggle?.();
  }, [expanded, onToggle]);

  const handleAction = useCallback((action: () => void) => {
    action();
    setExpanded(false);
  }, []);

  const actions = [
    {
      icon: <Add />,
      label: 'Add Todo',
      action: onAddTodo,
      color: theme.palette.primary.main,
    },
    {
      icon: <Search />,
      label: 'Search',
      action: onSearch,
      color: theme.palette.info.main,
    },
    {
      icon: <FilterList />,
      label: 'Filter',
      action: onFilter,
      color: theme.palette.warning.main,
    },
    {
      icon: <Edit />,
      label: 'Edit',
      action: onEdit,
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* Action buttons */}
      {actions.map((action, index) => (
        <Zoom
          key={action.label}
          in={expanded}
          timeout={200}
          style={{
            transitionDelay: expanded ? `${index * 50}ms` : '0ms',
          }}
        >
          <Tooltip title={action.label} placement="left">
            <Fab
              size="medium"
              onClick={() => handleAction(action.action)}
              sx={{
                backgroundColor: action.color,
                color: 'white',
                boxShadow: `0 4px 16px ${alpha(action.color, 0.3)}`,
                '&:hover': {
                  backgroundColor: action.color,
                  boxShadow: `0 6px 20px ${alpha(action.color, 0.4)}`,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {action.icon}
            </Fab>
          </Tooltip>
        </Zoom>
      ))}

      {/* Main FAB */}
      <Tooltip title={expanded ? 'Close' : 'Quick Actions'}>
        <Fab
          color="primary"
          onClick={handleToggle}
          sx={{
            backgroundColor: expanded 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
            color: 'white',
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              backgroundColor: expanded 
                ? theme.palette.error.dark 
                : theme.palette.primary.dark,
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          {expanded ? <Close /> : <Add />}
        </Fab>
      </Tooltip>
    </Box>
  );
});

ModernFAB.displayName = 'ModernFAB';

export default ModernFAB;
