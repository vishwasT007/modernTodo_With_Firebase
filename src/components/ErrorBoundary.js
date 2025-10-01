import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Stack,
  Alert,
  AlertTitle,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh,
  Home,
  BugReport,
  Support,
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Generate error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, errorId);
    }
  }

  reportError = (error, errorInfo, errorId) => {
    // This is where you would send the error to your error reporting service
    // For example: Sentry, LogRocket, Bugsnag, etc.
    console.log('Reporting error to service:', {
      errorId,
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
        onReload={this.handleReload}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, errorId, onRetry, onGoHome, onReload }) => {
  const theme = useTheme();
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 6,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          textAlign: 'center',
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${alpha(theme.palette.error.main, 0.8)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: `0 8px 32px ${alpha(theme.palette.error.main, 0.3)}`,
          }}
        >
          <ErrorIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        {/* Error Title */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
          Oops! Something went wrong
        </Typography>

        {/* Error Description */}
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
        </Typography>

        {/* Error ID for support */}
        {errorId && (
          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            <AlertTitle>Error Reference</AlertTitle>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              Error ID: {errorId}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Please include this ID when contacting support.
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
              },
            }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={onGoHome}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onReload}
          >
            Reload Page
          </Button>
        </Stack>

        {/* Development Error Details */}
        {isDevelopment && error && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                Development Error Details
              </Typography>
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Error Message</AlertTitle>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {error.toString()}
                </Typography>
              </Alert>
              {errorInfo && (
                <Alert severity="warning">
                  <AlertTitle>Component Stack</AlertTitle>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {errorInfo.componentStack}
                  </Typography>
                </Alert>
              )}
            </Box>
          </>
        )}

        {/* Support Information */}
        <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Support color="primary" />
            Need Help?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            If this problem persists, please contact our support team with the error ID above.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="text"
              startIcon={<BugReport />}
              onClick={() => window.open('mailto:support@todoapp.com?subject=Error Report&body=Error ID: ' + errorId, '_blank')}
            >
              Report Bug
            </Button>
            <Button
              variant="text"
              startIcon={<Support />}
              onClick={() => window.open('/help', '_blank')}
            >
              Get Support
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ErrorBoundary;