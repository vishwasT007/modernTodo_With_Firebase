import React, { memo, useMemo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  PriorityHigh,
  Flag,
  Schedule,
  DragIndicator,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Todo, TodoCardProps } from '../types';

// Configure dayjs plugins
dayjs.extend(relativeTime);

const DraggableTodoCard: React.FC<TodoCardProps> = memo(({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onMenuOpen,
}) => {
  const theme = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id || todo.todoId || '',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Memoized priority icon
  const priorityIcon = useMemo(() => {
    switch (todo.priority) {
      case 'high':
        return <PriorityHigh fontSize="small" color="error" />;
      case 'medium':
        return <Flag fontSize="small" color="warning" />;
      case 'low':
        return <Flag fontSize="small" color="success" />;
      default:
        return <Flag fontSize="small" />;
    }
  }, [todo.priority]);

  // Memoized priority color
  const priorityColor = useMemo(() => {
    switch (todo.priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  }, [todo.priority, theme.palette]);

  // Memoized due date display
  const dueDateDisplay = useMemo(() => {
    if (!todo.dueDate) return null;
    
    const dueDate = todo.dueDate instanceof Date ? todo.dueDate : new Date(todo.dueDate);
    const now = dayjs();
    const due = dayjs(dueDate);
    const isOverdue = due.isBefore(now) && !todo.completed;
    
    return {
      text: due.format('MMM DD, YYYY'),
      relative: due.fromNow(),
      isOverdue,
    };
  }, [todo.dueDate, todo.completed]);

  // Memoized created date display
  const createdDateDisplay = useMemo(() => {
    const created = dayjs(todo.createdAt);
    return created.fromNow();
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        opacity: todo.completed ? 0.7 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: isDragging ? 'none' : 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        borderLeft: `4px solid ${priorityColor}`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1 }}>
            {/* Drag Handle */}
            <Box
              {...attributes}
              {...listeners}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'grab',
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
            >
              <DragIndicator fontSize="small" />
            </Box>

            <Checkbox
              checked={todo.completed}
              onChange={handleToggleComplete}
              color="primary"
              size="small"
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                  wordBreak: 'break-word',
                }}
              >
                {todo.title}
              </Typography>
              {todo.body && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {todo.body}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={`${todo.priority} priority`}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {priorityIcon}
              </Box>
            </Tooltip>
            
            <Tooltip title="More options">
              <IconButton
                onClick={handleMenuOpen}
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

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip
            label={todo.priority}
            size="small"
            sx={{
              backgroundColor: alpha(priorityColor, 0.1),
              color: priorityColor,
              fontWeight: 500,
            }}
          />
          
          {dueDateDisplay && (
            <Chip
              icon={<Schedule fontSize="small" />}
              label={dueDateDisplay.text}
              size="small"
              sx={{
                backgroundColor: dueDateDisplay.isOverdue
                  ? alpha(theme.palette.error.main, 0.1)
                  : alpha(theme.palette.info.main, 0.1),
                color: dueDateDisplay.isOverdue
                  ? theme.palette.error.main
                  : theme.palette.info.main,
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
        >
          Created {createdDateDisplay}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Edit todo">
          <IconButton
            onClick={handleEdit}
            size="small"
            color="primary"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete todo">
          <IconButton
            onClick={handleDelete}
            size="small"
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
});

DraggableTodoCard.displayName = 'DraggableTodoCard';

export default DraggableTodoCard;
