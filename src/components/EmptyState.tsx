import React, { memo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Fade,
  Slide,
} from '@mui/material';
import {
  Add,
  CheckCircle,
  Search,
  FilterList,
  TaskAlt,
  Lightbulb,
} from '@mui/icons-material';

interface EmptyStateProps {
  type: 'no-todos' | 'no-results' | 'no-completed' | 'no-pending';
  onAction?: () => void;
  actionLabel?: string;
  searchQuery?: string;
}

const EmptyState: React.FC<EmptyStateProps> = memo(({
  type,
  onAction,
  actionLabel,
  searchQuery,
}) => {
  const theme = useTheme();

  const getEmptyStateConfig = () => {
    switch (type) {
      case 'no-todos':
        return {
          icon: <TaskAlt sx={{ fontSize: 80, color: theme.palette.primary.main }} />,
          title: 'No todos yet',
          description: 'Get started by creating your first todo. Click the "Add Todo" button to begin organizing your tasks.',
          actionLabel: 'Create Your First Todo',
          color: theme.palette.primary.main,
        };
      case 'no-results':
        return {
          icon: <Search sx={{ fontSize: 80, color: theme.palette.grey[400] }} />,
          title: 'No results found',
          description: searchQuery 
            ? `No todos match "${searchQuery}". Try adjusting your search terms or filters.`
            : 'No todos match your current filters. Try adjusting your filter settings.',
          actionLabel: 'Clear Filters',
          color: theme.palette.grey[500],
        };
      case 'no-completed':
        return {
          icon: <CheckCircle sx={{ fontSize: 80, color: theme.palette.success.main }} />,
          title: 'No completed todos',
          description: 'You haven\'t completed any todos yet. Start checking off some tasks to see them here!',
          actionLabel: 'View All Todos',
          color: theme.palette.success.main,
        };
      case 'no-pending':
        return {
          icon: <Lightbulb sx={{ fontSize: 80, color: theme.palette.warning.main }} />,
          title: 'All caught up!',
          description: 'Congratulations! You\'ve completed all your pending todos. Time to add some new tasks or take a well-deserved break.',
          actionLabel: 'Add New Todo',
          color: theme.palette.warning.main,
        };
      default:
        return {
          icon: <TaskAlt sx={{ fontSize: 80, color: theme.palette.grey[400] }} />,
          title: 'Nothing here',
          description: 'There\'s nothing to display at the moment.',
          actionLabel: 'Get Started',
          color: theme.palette.grey[500],
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          p: 4,
        }}
      >
        <Slide direction="up" in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(config.color, 0.05)} 0%, ${alpha(config.color, 0.02)} 100%)`,
              border: `1px solid ${alpha(config.color, 0.1)}`,
              maxWidth: 500,
              width: '100%',
            }}
          >
            {/* Icon with animation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                '& svg': {
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                    },
                  },
                },
              }}
            >
              {config.icon}
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: config.color,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              {config.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              {config.description}
            </Typography>

            {/* Action button */}
            {onAction && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAction}
                sx={{
                  backgroundColor: config.color,
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 25,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  boxShadow: `0 4px 16px ${alpha(config.color, 0.3)}`,
                  '&:hover': {
                    backgroundColor: config.color,
                    boxShadow: `0 6px 20px ${alpha(config.color, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {actionLabel || config.actionLabel}
              </Button>
            )}

            {/* Additional tips for no-results */}
            {type === 'no-results' && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontWeight: 500 }}
                >
                  💡 Search Tips:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    textAlign: 'left',
                    pl: 2,
                    m: 0,
                    '& li': {
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      mb: 0.5,
                    },
                  }}
                >
                  <li>Try different keywords</li>
                  <li>Check your spelling</li>
                  <li>Use broader search terms</li>
                  <li>Clear your filters</li>
                </Box>
              </Box>
            )}
          </Paper>
        </Slide>
      </Box>
    </Fade>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
