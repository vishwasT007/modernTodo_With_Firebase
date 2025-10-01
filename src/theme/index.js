import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Color palette
const colors = {
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
};

// Create theme function
export const createAppTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary[600],
        light: colors.primary[400],
        dark: colors.primary[800],
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.secondary[600],
        light: colors.secondary[400],
        dark: colors.secondary[800],
        contrastText: '#ffffff',
      },
      success: {
        main: colors.success[600],
        light: colors.success[400],
        dark: colors.success[800],
        contrastText: '#ffffff',
      },
      warning: {
        main: colors.warning[600],
        light: colors.warning[400],
        dark: colors.warning[800],
        contrastText: '#ffffff',
      },
      error: {
        main: colors.error[600],
        light: colors.error[400],
        dark: colors.error[800],
        contrastText: '#ffffff',
      },
      info: {
        main: colors.info[600],
        light: colors.info[400],
        dark: colors.info[800],
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#fafafa' : '#0a0a0a',
        paper: isLight ? '#ffffff' : '#1a1a1a',
        elevated: isLight ? '#ffffff' : '#2a2a2a',
        gradient: isLight 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      },
      text: {
        primary: isLight ? '#1a1a1a' : '#ffffff',
        secondary: isLight ? '#6b7280' : '#9ca3af',
        disabled: isLight ? '#9ca3af' : '#6b7280',
      },
      divider: isLight ? alpha('#000000', 0.12) : alpha('#ffffff', 0.12),
      grey: {
        50: isLight ? '#f9fafb' : '#111827',
        100: isLight ? '#f3f4f6' : '#1f2937',
        200: isLight ? '#e5e7eb' : '#374151',
        300: isLight ? '#d1d5db' : '#4b5563',
        400: isLight ? '#9ca3af' : '#6b7280',
        500: isLight ? '#6b7280' : '#9ca3af',
        600: isLight ? '#4b5563' : '#d1d5db',
        700: isLight ? '#374151' : '#e5e7eb',
        800: isLight ? '#1f2937' : '#f3f4f6',
        900: isLight ? '#111827' : '#f9fafb',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
        letterSpacing: '-0.025em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
        letterSpacing: '-0.025em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
        letterSpacing: '-0.025em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.025em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      isLight ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.3)',
      isLight ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.3)',
      isLight ? '0 10px 15px rgba(0, 0, 0, 0.1)' : '0 10px 15px rgba(0, 0, 0, 0.3)',
      isLight ? '0 20px 25px rgba(0, 0, 0, 0.1)' : '0 20px 25px rgba(0, 0, 0, 0.3)',
      isLight ? '0 25px 50px rgba(0, 0, 0, 0.15)' : '0 25px 50px rgba(0, 0, 0, 0.4)',
      ...Array(19).fill(isLight ? '0 25px 50px rgba(0, 0, 0, 0.15)' : '0 25px 50px rgba(0, 0, 0, 0.4)'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isLight ? '#c1c1c1 #f1f1f1' : '#4a4a4a #2a2a2a',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: isLight ? '#c1c1c1' : '#4a4a4a',
              '&:hover': {
                backgroundColor: isLight ? '#a8a8a8' : '#6a6a6a',
              },
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              borderRadius: 8,
              backgroundColor: isLight ? '#f1f1f1' : '#2a2a2a',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isLight 
                ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: isLight 
                ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                : '0 8px 25px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight 
              ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0 1px 3px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              boxShadow: isLight 
                ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: isLight 
              ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0 1px 3px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            backgroundColor: isLight 
              ? alpha('#ffffff', 0.8) 
              : alpha('#1a1a1a', 0.8),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${isLight ? alpha('#000000', 0.12) : alpha('#ffffff', 0.12)}`,
            backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
          },
        },
      },
    },
  });
};

// Export default light theme
export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');
