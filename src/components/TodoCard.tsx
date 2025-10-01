import React, { memo, useMemo, useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Box,
  alpha,
  useTheme,
  Fade,
  Slide,
  Collapse,
  Badge,
  Avatar,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  PriorityHigh,
  Flag,
  Schedule,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  DragIndicator,
  Star,
  StarBorder,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Todo, TodoCardProps } from '../types';

// Configure dayjs plugins
dayjs.extend(relativeTime);

const TodoCard: React.FC<TodoCardProps> = memo(({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onMenuOpen,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Memoized priority configuration
  const priorityConfig = useMemo(() => {
    switch (todo.priority) {
      case 'high':
        return {
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          icon: <PriorityHigh fontSize="small" />,
          label: 'High Priority',
          gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${alpha(theme.palette.error.main, 0.7)} 100%)`,
        };
      case 'medium':
        return {
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          icon: <Flag fontSize="small" />,
          label: 'Medium Priority',
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${alpha(theme.palette.warning.main, 0.7)} 100%)`,
        };
      case 'low':
        return {
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          icon: <Star fontSize="small" />,
          label: 'Low Priority',
          gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.7)} 100%)`,
        };
      default:
        return {
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.1),
          icon: <Flag fontSize="small" />,
          label: 'No Priority',
          gradient: `linear-gradient(135deg, ${theme.palette.grey[500]} 0%, ${alpha(theme.palette.grey[500], 0.7)} 100%)`,
        };
    }
  }, [todo.priority, theme.palette]);

  // Memoized due date display
  const dueDateConfig = useMemo(() => {
    if (!todo.dueDate) return null;
    
    try {
      const dueDate = todo.dueDate instanceof Date ? todo.dueDate : new Date(todo.dueDate);
      
      // Check if date is valid
      if (isNaN(dueDate.getTime())) {
        return null; // Return null for invalid dates
      }
      
      const now = dayjs();
      const due = dayjs(dueDate);
      
      // Double check dayjs validity
      if (!due.isValid()) {
        return null;
      }
      
      const isOverdue = due.isBefore(now) && !todo.completed;
      const isDueSoon = due.diff(now, 'hours') <= 24 && due.diff(now, 'hours') > 0;
    
      return {
        text: due.format('MMM DD, YYYY'),
        relative: due.fromNow(),
        isOverdue,
        isDueSoon,
        color: isOverdue ? theme.palette.error.main : isDueSoon ? theme.palette.warning.main : theme.palette.info.main,
      };
    } catch (error) {
      console.error('Invalid due date:', error);
      return null;
    }
  }, [todo.dueDate, todo.completed, theme.palette]);

  // Memoized created date display
  const createdDateDisplay = useMemo(() => {
    try {
      const created = dayjs(todo.createdAt);
      if (!created.isValid()) {
        return 'Date unavailable';
      }
      return created.fromNow();
    } catch (error) {
      console.error('Invalid created date:', error);
      return 'Date unavailable';
    }
  }, [todo.createdAt]);

  // Memoized handlers
  const handleToggleComplete = useCallback(() => {
    onToggleComplete(todo);
  }, [onToggleComplete, todo]);

  const handleEdit = useCallback(() => {
    onEdit(todo);
  }, [onEdit, todo]);

  const handleDelete = useCallback(() => {
    onDelete(todo);
  }, [onDelete, todo]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    onMenuOpen(event, todo);
  }, [onMenuOpen, todo]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowActions(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowActions(false);
  }, []);

  return (
    <Fade in timeout={300}>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          border: `1px solid ${alpha(priorityConfig.color, 0.2)}`,
          background: todo.completed 
            ? `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.8)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(priorityConfig.color, 0.02)} 100%)`,
          boxShadow: isHovered 
            ? `0 8px 32px ${alpha(priorityConfig.color, 0.15)}`
            : `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: todo.completed ? 0.8 : 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: priorityConfig.gradient,
            zIndex: 1,
          },
        }}
      >
        {/* Priority indicator line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: priorityConfig.gradient,
            zIndex: 1,
          }}
        />

        <CardContent sx={{ pt: 3, pb: 2 }}>
          {/* Header with checkbox and title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              mb: 2,
            }}
          >
            {/* Custom checkbox */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: `2px solid ${todo.completed ? priorityConfig.color : theme.palette.grey[300]}`,
                backgroundColor: todo.completed ? priorityConfig.color : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={handleToggleComplete}
            >
              {todo.completed && (
                <CheckCircle 
                  sx={{ 
                    fontSize: 16, 
                    color: 'white',
                    transition: 'all 0.2s ease',
                  }} 
                />
              )}
            </Box>

            {/* Title and description */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  lineHeight: 1.4,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                  wordBreak: 'break-word',
                  mb: todo.body ? 1 : 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {todo.title}
              </Typography>
              
              {todo.body && (
                <Collapse in={!todo.completed || isHovered} timeout={200}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: todo.completed ? 1 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {todo.body}
                  </Typography>
                </Collapse>
              )}
            </Box>

            {/* Priority indicator and actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={priorityConfig.label}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: priorityConfig.bgColor,
                    color: priorityConfig.color,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {priorityConfig.icon}
                </Box>
              </Tooltip>

              <Collapse in={showActions} timeout={200}>
                <Tooltip title="More options">
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Collapse>
            </Box>
          </Box>

          {/* Tags and metadata */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              label={todo.priority}
              size="small"
              icon={priorityConfig.icon}
              sx={{
                backgroundColor: priorityConfig.bgColor,
                color: priorityConfig.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
            
            {dueDateConfig && (
              <Chip
                icon={<AccessTime fontSize="small" />}
                label={dueDateConfig.text}
                size="small"
                sx={{
                  backgroundColor: alpha(dueDateConfig.color, 0.1),
                  color: dueDateConfig.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                  border: dueDateConfig.isOverdue ? `1px solid ${alpha(dueDateConfig.color, 0.3)}` : 'none',
                }}
              />
            )}

            {todo.completed && (
              <Chip
                icon={<CheckCircle fontSize="small" />}
                label="Completed"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            )}
          </Box>

          {/* Footer with creation date */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: 1,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ 
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <AccessTime fontSize="small" />
              Created {createdDateDisplay}
            </Typography>

            {dueDateConfig && (
              <Typography
                variant="caption"
                color={dueDateConfig.color}
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                {dueDateConfig.relative}
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Action buttons - only show on hover */}
        <Collapse in={showActions} timeout={200}>
          <CardActions 
            sx={{ 
              justifyContent: 'flex-end', 
              pt: 0, 
              pb: 2,
              px: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Tooltip title="Edit todo">
              <IconButton
                onClick={handleEdit}
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete todo">
              <IconButton
                onClick={handleDelete}
                size="small"
                sx={{
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Collapse>
      </Card>
    </Fade>
  );
});

TodoCard.displayName = 'TodoCard';

export default TodoCard;
