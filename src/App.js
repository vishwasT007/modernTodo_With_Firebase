import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Context Providers
import { AppProvider, useApp } from './context/AppContext';
import { FirebaseProvider } from './context/FirebaseContext';

// Theme
import { lightTheme, darkTheme } from './theme';

// Error handling
import { suppressFirestorePermissionErrors } from './utils/firestoreErrorHandler';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import ModernDashboard from './components/ModernDashboard';
import Layout from './components/Layout';
import ModernLayout from './components/ModernLayout';
import AuthWrapper from './components/AuthWrapper';
import ModernTodoList from './components/ModernTodoList';
import Account from './components/Account';
import ErrorBoundary from './components/ErrorBoundary';

// Landing Page Component
const LandingPage = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s ease-in-out infinite',
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '20px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          TodoApp Pro
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '50px', 
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 50px auto',
          lineHeight: 1.6,
        }}>
          The ultimate task management solution for modern productivity
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginBottom: '60px',
        }}>
          <button 
            style={{ 
              padding: '18px 36px', 
              backgroundColor: 'rgba(255,255,255,0.15)', 
              color: 'white', 
              border: '2px solid rgba(255,255,255,0.3)', 
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
              e.target.style.transform = 'translateY(0)';
            }}
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
          <button 
            style={{ 
              padding: '18px 36px', 
              backgroundColor: 'white', 
              color: isDark ? '#1a1a2e' : '#667eea', 
              border: '2px solid white', 
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </button>
        </div>
        
        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {[
            { icon: '🚀', title: 'Fast & Responsive', desc: 'Lightning-fast performance' },
            { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade security' },
            { icon: '📱', title: 'Cross-Platform', desc: 'Works on all devices' },
            { icon: '⚡', title: 'Real-time Sync', desc: 'Always up to date' },
          ].map((feature, index) => (
            <div key={index} style={{
              padding: '30px 20px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

// Theme-aware component
const ThemedApp = () => {
  const appContext = useApp();
  const themeMode = appContext?.theme || 'light';
  
  // Ensure we always use a valid theme object
  const muiTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={
              <AuthWrapper requireAuth={false}>
                <LandingPage />
              </AuthWrapper>
            } />
            <Route path="/login" element={
              <AuthWrapper requireAuth={false}>
                <Login />
              </AuthWrapper>
            } />
            <Route path="/signup" element={
              <AuthWrapper requireAuth={false}>
                <Signup />
              </AuthWrapper>
            } />
            <Route path="/dashboard" element={
              <AuthWrapper requireAuth={true}>
                <ModernLayout>
                  <ModernDashboard />
                </ModernLayout>
              </AuthWrapper>
            } />
            <Route path="/todos" element={
              <AuthWrapper requireAuth={true}>
                <ModernLayout>
                  <ModernTodoList />
                </ModernLayout>
              </AuthWrapper>
            } />
            <Route path="/account" element={
              <AuthWrapper requireAuth={true}>
                <ModernLayout>
                  <Account />
                </ModernLayout>
              </AuthWrapper>
            } />
            <Route path="*" element={<Navigate to="/todos" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

// Main App Component
function App() {
  console.log('App component is rendering!');
  
  // Suppress Firestore permission errors to reduce console noise
  useEffect(() => {
    suppressFirestorePermissionErrors();
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <FirebaseProvider>
          <ThemedApp />
        </FirebaseProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;