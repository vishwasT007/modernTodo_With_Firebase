import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Zoom,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  ArrowBack,
  Security,
  Speed,
  Star,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useFirebase } from '../context/FirebaseContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const { signInWithEmail } = useFirebase();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

        try {
          const { user, error } = await signInWithEmail(formData.email, formData.password);
          
          if (user) {
            addNotification('Login successful!', 'success');
            navigate('/dashboard');
          } else {
            // Handle specific Firebase errors
            let errorMessage = 'Login failed. Please check your credentials.';
            if (error.includes('user-not-found')) {
              errorMessage = 'No account found with this email. Please sign up first.';
            } else if (error.includes('wrong-password')) {
              errorMessage = 'Incorrect password. Please try again.';
            } else if (error.includes('invalid-email')) {
              errorMessage = 'Please enter a valid email address.';
            } else if (error.includes('too-many-requests')) {
              errorMessage = 'Too many failed attempts. Please try again later.';
            }
            
            setErrors({ general: errorMessage });
            addNotification(errorMessage, 'error');
          }
        } catch (error) {
          console.error('Login error:', error);
          let errorMessage = 'Network error. Please try again.';
          if (error.message && error.message.includes('user-not-found')) {
            errorMessage = 'No account found with this email. Please sign up first.';
          }
          setErrors({ general: errorMessage });
          addNotification(errorMessage, 'error');
        } finally {
          setLoading(false);
        }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Signing you in..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            {/* Back Button */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1,
              }}
            >
              <Tooltip title="Go back to home">
                <IconButton
                  onClick={() => navigate('/')}
                  sx={{
                    color: '#667eea',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
                mt: 2,
              }}
            >
              <Zoom in={true} timeout={1000}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '-2px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      zIndex: -1,
                      opacity: 0.3,
                      filter: 'blur(8px)',
                    },
                  }}
                >
                  <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
              </Zoom>
              
              <Typography 
                component="h1" 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                }}
              >
                Welcome Back
              </Typography>
              
              <Typography 
                variant="body1" 
                color="textSecondary" 
                align="center" 
                sx={{ 
                  fontSize: '1.1rem',
                  maxWidth: 400,
                  mb: 2,
                }}
              >
                Sign in to your account and continue your productivity journey
              </Typography>

              {/* Feature Chips */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip
                  icon={<Security />}
                  label="Secure"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<Speed />}
                  label="Fast"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<Star />}
                  label="Premium"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                    },
                  },
                }}
              />

              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: '#667eea',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                    },
                  },
                }}
              />

              {errors.general && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#f44336',
                    },
                  }}
                >
                  {errors.general}
                  {errors.general.includes('No account found') && (
                    <Box sx={{ mt: 1 }}>
                      <Link
                        component={RouterLink}
                        to="/signup"
                        sx={{ 
                          color: '#f44336',
                          textDecoration: 'underline',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'none',
                          },
                        }}
                      >
                        Click here to create an account
                      </Link>
                    </Box>
                  )}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !formData.email || !formData.password}
                sx={{
                  mb: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" sx={{ px: 2 }}>
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Don't have an account?{' '}
                </Typography>
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{ 
                    fontWeight: 600,
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#5a6fd8',
                    },
                  }}
                >
                  Create your account here
                </Link>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
