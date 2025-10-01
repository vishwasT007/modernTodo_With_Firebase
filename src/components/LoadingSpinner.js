import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import {
  TaskAlt,
  TrendingUp,
  Speed,
  Security,
} from '@mui/icons-material';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  fullScreen = false, 
  size = 40,
  showTips = true,
  variant = 'default' // 'default', 'minimal', 'fancy'
}) => {
  const theme = useTheme();

  const tips = [
    "Pro tip: Use keyboard shortcuts to work faster",
    "Did you know? You can drag and drop todos to reorder them",
    "Try using the search feature to quickly find specific todos",
    "Set due dates to stay on top of your deadlines",
    "Use priority levels to focus on what matters most",
    "Mark todos as completed to track your progress",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  if (variant === 'minimal') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <CircularProgress size={size} />
        {message && (
          <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'fancy') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: fullScreen ? '100vh' : '200px',
          p: 4,
          background: fullScreen 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
            : 'transparent',
        }}
      >
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            {/* Outer rotating ring */}
            <CircularProgress
              size={size * 2}
              thickness={2}
              sx={{
                color: alpha(theme.palette.primary.main, 0.3),
                position: 'absolute',
              }}
            />
            {/* Inner rotating ring */}
            <CircularProgress
              size={size * 1.5}
              thickness={3}
              sx={{
                color: alpha(theme.palette.secondary.main, 0.5),
                position: 'absolute',
                animation: 'spin 1.5s linear infinite reverse',
              }}
            />
            {/* Center icon */}
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <TaskAlt sx={{ color: 'white', fontSize: size * 0.5 }} />
            </Box>
          </Box>
        </Fade>

        <Fade in={true} timeout={1200}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {message}
          </Typography>
        </Fade>

        {showTips && (
          <Fade in={true} timeout={1600}>
            <Box
              sx={{
                maxWidth: 400,
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                💡 {randomTip}
              </Typography>
            </Box>
          </Fade>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </Box>
    );
  }

  // Default variant
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        p: 4,
        background: fullScreen 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
          : 'transparent',
      }}
    >
      <Fade in={true} timeout={600}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CircularProgress 
            size={size} 
            sx={{ 
              color: theme.palette.primary.main,
            }} 
          />
        </Box>
      </Fade>

      <Fade in={true} timeout={800}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: 'text.primary',
          }}
        >
          {message}
        </Typography>
      </Fade>

      {showTips && (
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              maxWidth: 400,
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              background: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
              💡 {randomTip}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Feature highlights */}
      {fullScreen && (
        <Fade in={true} timeout={1200}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
              mt: 4,
              maxWidth: 600,
            }}
          >
            {[
              { icon: <Speed />, text: 'Lightning Fast' },
              { icon: <Security />, text: 'Secure & Private' },
              { icon: <TrendingUp />, text: 'Productivity Boost' },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                {feature.icon}
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default LoadingSpinner;