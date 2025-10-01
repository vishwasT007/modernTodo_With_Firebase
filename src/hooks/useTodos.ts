import { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, TodoFormData, TodoFilters, TodoStats } from '../types';
import { useApp } from './useApp';
import { useFirebase } from './useFirebase';

export const useTodos = () => {
  const { todos: appTodos, loading: appLoading, error, addTodo, updateTodo, deleteTodo } = useApp();
  const { firebaseTodos, loading: firebaseLoading } = useFirebase();
  
  // Use Firebase todos if available, fallback to app todos
  const todos = firebaseTodos && firebaseTodos.length > 0 ? firebaseTodos : appTodos;
  const loading = firebaseLoading || appLoading;
  
  const [filters, setFilters] = useState<TodoFilters>({
    priority: 'all',
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Memoized filtered and sorted todos
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(todo => 
        filters.status === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.body.toLowerCase().includes(searchLower)
      );
    }

    // Sort todos
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [todos, filters]);

  // Memoized todo statistics
  const stats = useMemo((): TodoStats => {
    const now = new Date();
    
    return {
      total: todos.length,
      completed: todos.filter((todo: Todo) => todo.completed).length,
      pending: todos.filter((todo: Todo) => !todo.completed).length,
      overdue: todos.filter((todo: Todo) => 
        !todo.completed && 
        todo.dueDate && 
        new Date(todo.dueDate) < now
      ).length,
      highPriority: todos.filter((todo: Todo) => todo.priority === 'high').length,
      mediumPriority: todos.filter((todo: Todo) => todo.priority === 'medium').length,
      lowPriority: todos.filter((todo: Todo) => todo.priority === 'low').length,
    };
  }, [todos]);

  // Memoized handlers
  const handleAddTodo = useCallback(async (todoData: TodoFormData) => {
    await addTodo(todoData);
  }, [addTodo]);

  const handleUpdateTodo = useCallback(async (todoId: string, todoData: Partial<TodoFormData>) => {
    await updateTodo(todoId, todoData);
  }, [updateTodo]);

  const handleDeleteTodo = useCallback(async (todoId: string) => {
    await deleteTodo(todoId);
  }, [deleteTodo]);

  const handleToggleComplete = useCallback(async (todo: Todo) => {
    const todoId = todo.todoId || todo.id;
    if (todoId) {
      await updateTodo(todoId, { completed: !todo.completed });
    }
  }, [updateTodo]);

  const updateFilters = useCallback((newFilters: Partial<TodoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      priority: 'all',
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  return {
    todos: filteredTodos,
    allTodos: todos,
    loading,
    error,
    filters,
    stats,
    addTodo: handleAddTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    toggleComplete: handleToggleComplete,
    updateFilters,
    clearFilters,
  };
};
