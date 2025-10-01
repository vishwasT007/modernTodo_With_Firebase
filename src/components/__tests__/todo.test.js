import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Todo from '../todo';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock the config
jest.mock('../../config', () => ({
  api: {
    baseURL: 'https://test-api.com',
    endpoints: {
      todos: '/todos',
      todo: '/todo',
    },
  },
}));

// Mock withStyles
jest.mock('@material-ui/core/styles', () => ({
  withStyles: (styles) => (Component) => Component,
}));

// Mock auth utility
jest.mock('../../util/auth', () => ({
  authMiddleWare: jest.fn(),
}));

const mockTodos = [
  {
    todoId: '1',
    title: 'Test Todo 1',
    body: 'This is a test todo',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    todoId: '2',
    title: 'Test Todo 2',
    body: 'This is another test todo',
    createdAt: '2023-01-02T00:00:00Z',
  },
];

const renderTodo = () => {
  return render(<Todo />);
};

describe('Todo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('AuthToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderTodo();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders todos after loading', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTodos });

    renderTodo();

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });
  });

  it('opens create todo dialog when add button is clicked', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    renderTodo();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const addButton = screen.getByLabelText('Add Todo');
    fireEvent.click(addButton);

    expect(screen.getByText('Create a new Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo Details')).toBeInTheDocument();
  });

  it('creates a new todo', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedAxios.mockResolvedValueOnce({ data: {} });

    renderTodo();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Open create dialog
    const addButton = screen.getByLabelText('Add Todo');
    fireEvent.click(addButton);

    // Fill form
    const titleInput = screen.getByLabelText('Todo Title');
    const bodyInput = screen.getByLabelText('Todo Details');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    fireEvent.change(bodyInput, { target: { value: 'New todo body' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledWith({
        url: 'https://test-api.com/todo',
        method: 'post',
        data: {
          title: 'New Todo',
          body: 'New todo body',
        },
      });
    });
  });

  it('deletes a todo', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockTodos });
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });

    // Mock window.location.reload
    delete window.location;
    window.location = { reload: jest.fn() };

    renderTodo();

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('https://test-api.com/todo/1');
    });
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    renderTodo();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Should not crash and should show empty state
    expect(screen.getByLabelText('Add Todo')).toBeInTheDocument();
  });
});
