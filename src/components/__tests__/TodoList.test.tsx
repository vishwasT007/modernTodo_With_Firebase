import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TodoList from '../TodoList';
import { AppProvider } from '../../context/AppContext';
import { FirebaseProvider } from '../../context/FirebaseContext';

// Mock the hooks
jest.mock('../../hooks/useApp', () => ({
  useApp: () => ({
    todos: [
      {
        id: '1',
        title: 'Test Todo',
        body: 'Test description',
        priority: 'high',
        completed: false,
        dueDate: new Date('2024-12-31'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'test-user',
      },
    ],
    loading: false,
    error: null,
    addTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    addNotification: jest.fn(),
  }),
}));

jest.mock('../../hooks/useFirebase', () => ({
  useFirebase: () => ({
    user: { uid: 'test-user', email: 'test@example.com' },
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
    updateProfile: jest.fn(),
  }),
}));

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return {
    ...originalDayjs,
    extend: jest.fn(),
  };
});

const theme = createTheme();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FirebaseProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </FirebaseProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

describe('TodoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    expect(screen.getByText('Add New Todo')).toBeInTheDocument();
  });

  it('displays todos correctly', () => {
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('opens add todo dialog when Add New Todo button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    const addButton = screen.getByText('Add New Todo');
    await user.click(addButton);
    
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  it('opens edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    // Find and click the more options button
    const moreButton = screen.getByLabelText('More options');
    await user.click(moreButton);
    
    // Find and click the edit option
    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    
    expect(screen.getByText('Edit Todo')).toBeInTheDocument();
  });

  it('toggles todo completion when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const mockUpdateTodo = jest.fn();
    
    // Mock the updateTodo function
    jest.doMock('../../hooks/useApp', () => ({
      useApp: () => ({
        todos: [
          {
            id: '1',
            title: 'Test Todo',
            body: 'Test description',
            priority: 'high',
            completed: false,
            dueDate: new Date('2024-12-31'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: 'test-user',
          },
        ],
        loading: false,
        error: null,
        addTodo: jest.fn(),
        updateTodo: mockUpdateTodo,
        deleteTodo: jest.fn(),
        addNotification: jest.fn(),
      }),
    }));
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(mockUpdateTodo).toHaveBeenCalledWith('1', { completed: true });
  });

  it('filters todos by priority', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    const priorityFilter = screen.getByLabelText('Priority');
    await user.selectOptions(priorityFilter, 'high');
    
    // The todo should still be visible since it's high priority
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('searches todos by title', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    const searchInput = screen.getByPlaceholderText('Search todos...');
    await user.type(searchInput, 'Test');
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });
});

describe('TodoList Form Validation', () => {
  it('shows validation error for empty title', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    // Open add todo dialog
    const addButton = screen.getByText('Add New Todo');
    await user.click(addButton);
    
    // Try to submit without filling title
    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  it('allows valid todo submission', async () => {
    const user = userEvent.setup();
    const mockAddTodo = jest.fn();
    
    // Mock the addTodo function
    jest.doMock('../../hooks/useApp', () => ({
      useApp: () => ({
        todos: [],
        loading: false,
        error: null,
        addTodo: mockAddTodo,
        updateTodo: jest.fn(),
        deleteTodo: jest.fn(),
        addNotification: jest.fn(),
      }),
    }));
    
    render(
      <TestWrapper>
        <TodoList />
      </TestWrapper>
    );
    
    // Open add todo dialog
    const addButton = screen.getByText('Add New Todo');
    await user.click(addButton);
    
    // Fill in the form
    await user.type(screen.getByLabelText('Title'), 'New Todo');
    await user.type(screen.getByLabelText('Description'), 'New description');
    
    // Submit the form
    const submitButton = screen.getByText('Add Todo');
    await user.click(submitButton);
    
    expect(mockAddTodo).toHaveBeenCalledWith({
      title: 'New Todo',
      body: 'New description',
      priority: 'medium',
      dueDate: null,
      completed: false,
    });
  });
});
