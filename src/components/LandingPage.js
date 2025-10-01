import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Assignment,
  Dashboard,
  PersonAdd,
  Login as LoginIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={12}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Zoom in={true} timeout={1500}>
              <Box sx={{ mb: 4 }}>
                <Assignment
                  sx={{
                    fontSize: 80,
                    color: 'primary.main',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  TodoApp Pro
                </Typography>
                <Typography
                  variant="h5"
                  color="textSecondary"
                  sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
                >
                  Organize your tasks, boost your productivity, and achieve your goals
                  with our modern, intuitive todo application.
                </Typography>
              </Box>
            </Zoom>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  },
                }}
              >
                Sign In
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/signup')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>

            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Features
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                  gap: 3,
                  mt: 2,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Dashboard sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Smart Dashboard
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Visualize your progress with charts and analytics
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Task Management
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Create, organize, and track your todos efficiently
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <PersonAdd sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    User Profiles
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Manage your account and personalize your experience
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LandingPage;
