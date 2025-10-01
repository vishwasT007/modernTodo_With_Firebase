import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { createTodo, updateTodo as updateTodoFirestore, deleteTodo as deleteTodoFirestore } from '../firebase/firestore';
import { getCurrentUser } from '../firebase/auth';

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) {
    return savedTheme;
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// Initial state
const initialState = {
  user: null,
  todos: [],
  loading: false,
  error: null,
  theme: getInitialTheme(),
  notifications: [],
  stats: {
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    overdueTodos: 0
  },
  sidebarOpen: true,
  mobileSidebarOpen: false,
};

// Action types
export const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_STATS: 'UPDATE_STATS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_MOBILE_SIDEBAR: 'TOGGLE_MOBILE_SIDEBAR',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload, error: null };
    
    case ActionTypes.SET_TODOS:
      return { 
        ...state, 
        todos: action.payload, 
        loading: false,
        error: null 
      };
    
    case ActionTypes.ADD_TODO:
      return { 
        ...state, 
        todos: [...state.todos, action.payload],
        loading: false 
      };
    
    case ActionTypes.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.todoId === action.payload.todoId ? action.payload : todo
        ),
        loading: false
      };
    
    case ActionTypes.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.todoId !== action.payload),
        loading: false
      };
    
    case ActionTypes.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newTheme);
      return { ...state, theme: newTheme };
    
    case ActionTypes.SET_THEME:
      localStorage.setItem('app-theme', action.payload);
      return { ...state, theme: action.payload };
    
    case ActionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case ActionTypes.TOGGLE_MOBILE_SIDEBAR:
      return { ...state, mobileSidebarOpen: !state.mobileSidebarOpen };
    
    case ActionTypes.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case ActionTypes.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    
    case ActionTypes.UPDATE_STATS:
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const authToken = localStorage.getItem('AuthToken');
      if (authToken) {
        try {
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });
          axios.defaults.headers.common = { Authorization: authToken };
          const response = await axios.get(`${config.api.baseURL}${config.api.endpoints.user}`);
          dispatch({ type: ActionTypes.SET_USER, payload: response.data.userCredentials });
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load user data' });
          localStorage.removeItem('AuthToken');
        }
      }
    };

    loadUserData();
  }, []);

  // Load todos when user is available
  useEffect(() => {
    const loadTodos = async () => {
      if (state.user) {
        try {
          dispatch({ type: ActionTypes.SET_LOADING, payload: true });
          const response = await axios.get(`${config.api.baseURL}${config.api.endpoints.todos}`);
          dispatch({ type: ActionTypes.SET_TODOS, payload: response.data });
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load todos' });
        }
      }
    };

    loadTodos();
  }, [state.user]);

  // Calculate stats when todos change
  useEffect(() => {
    if (state.todos.length > 0) {
      const now = new Date();
      const stats = {
        totalTodos: state.todos.length,
        completedTodos: state.todos.filter(todo => todo.completed).length,
        pendingTodos: state.todos.filter(todo => !todo.completed).length,
        overdueTodos: state.todos.filter(todo => 
          !todo.completed && new Date(todo.dueDate) < now
        ).length
      };
      dispatch({ type: ActionTypes.UPDATE_STATS, payload: stats });
    }
  }, [state.todos]);

  // Actions
  const addTodo = async (todoData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      // Get current user from Firebase Auth
      const currentUser = getCurrentUser();
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      
      const { id, error } = await createTodo(currentUser.uid, todoData);
      if (error) {
        throw new Error(error);
      }
      
      // Create the todo object with the returned ID
      const newTodo = {
        todoId: id,
        ...todoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: ActionTypes.ADD_TODO, payload: newTodo });
      addNotification('Todo created successfully!', 'success');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to create todo' });
      addNotification('Failed to create todo', 'error');
      console.error('Add todo error:', error);
    }
  };

  const updateTodo = async (todoId, todoData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      // Validate todoId
      if (!todoId) {
        throw new Error('Todo ID is required for update');
      }
      
      console.log('Updating todo:', { todoId, todoData });
      
      const { success, error } = await updateTodoFirestore(todoId, {
        ...todoData,
        updatedAt: new Date().toISOString(),
      });
      
      if (!success) {
        throw new Error(error);
      }
      
      // Update the local state
      const updatedTodo = {
        todoId,
        ...todoData,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: ActionTypes.UPDATE_TODO, payload: updatedTodo });
      addNotification('Todo updated successfully!', 'success');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to update todo' });
      addNotification('Failed to update todo', 'error');
      console.error('Update todo error:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      const { success, error } = await deleteTodoFirestore(todoId);
      if (!success) {
        throw new Error(error);
      }
      
      dispatch({ type: ActionTypes.DELETE_TODO, payload: todoId });
      addNotification('Todo deleted successfully!', 'success');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to delete todo' });
      addNotification('Failed to delete todo', 'error');
      console.error('Delete todo error:', error);
    }
  };

  const addNotification = useCallback((message, type = 'info') => {
    // Generate unique ID using timestamp + random string to avoid duplicates
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification = {
      id: uniqueId,
      message,
      type,
      timestamp: new Date()
    };
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: notification.id });
    }, 5000);
  }, []); // Empty deps - dispatch is stable

  const removeNotification = useCallback((id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: [] });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_THEME });
  }, []);

  const setTheme = useCallback((theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_MOBILE_SIDEBAR });
  }, []);

  const setSidebarOpen = useCallback((open) => {
    dispatch({ type: ActionTypes.SET_SIDEBAR_OPEN, payload: open });
  }, []);

  const logout = () => {
    localStorage.removeItem('AuthToken');
    dispatch({ type: ActionTypes.SET_USER, payload: null });
    dispatch({ type: ActionTypes.SET_TODOS, payload: [] });
    addNotification('Logged out successfully', 'info');
  };

  const value = {
    ...state,
    addTodo,
    updateTodo,
    deleteTodo,
    addNotification,
    removeNotification,
    clearAllNotifications,
    toggleTheme,
    setTheme,
    toggleSidebar,
    toggleMobileSidebar,
    setSidebarOpen,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
