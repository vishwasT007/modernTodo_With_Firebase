import React from 'react';
import App from './App';

// Mock all dependencies
jest.mock('@material-ui/core/styles', () => ({
  ThemeProvider: ({ children }) => children,
  createMuiTheme: () => ({}),
}));

jest.mock('./pages/login', () => () => <div>Login Page</div>);
jest.mock('./pages/signup', () => () => <div>Signup Page</div>);
jest.mock('./pages/home', () => () => <div>Home Page</div>);

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Route: ({ component: Component }) => <Component />,
  Switch: ({ children }) => <div data-testid="switch">{children}</div>,
}));

test('App component can be imported', () => {
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
