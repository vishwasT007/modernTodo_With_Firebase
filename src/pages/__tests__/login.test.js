import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../login';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock the config
jest.mock('../../config', () => ({
  api: {
    baseURL: 'https://test-api.com',
    endpoints: {
      login: '/login',
    },
  },
}));

// Mock withStyles
jest.mock('@material-ui/core/styles', () => ({
  withStyles: (styles) => (Component) => Component,
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    renderLogin();
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('disables submit button when form is empty', () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is filled', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('handles form submission successfully', async () => {
    const mockResponse = {
      data: { token: 'mock-token' },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const mockHistory = { push: jest.fn() };
    jest.spyOn(require('react-router-dom'), 'useHistory').mockReturnValue(mockHistory);

    renderLogin();

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://test-api.com/login',
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('AuthToken', 'Bearer mock-token');
  });

  it('handles form submission with error', async () => {
    const mockError = {
      response: {
        data: { general: 'Invalid credentials' },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    renderLogin();

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
