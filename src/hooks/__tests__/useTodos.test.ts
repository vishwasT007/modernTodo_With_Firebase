import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { useApp } from '../useApp';

// Mock the useApp hook
jest.mock('../useApp');
const mockUseApp = useApp as jest.MockedFunction<typeof useApp>;

describe('useTodos', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'Test Todo 1',
      body: 'Test description 1',
      priority: 'high' as const,
      completed: false,
      dueDate: new Date('2024-12-31'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'test-user',
    },
    {
      id: '2',
      title: 'Test Todo 2',
      body: 'Test description 2',
      priority: 'low' as const,
      completed: true,
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'test-user',
    },
  ];

  const mockAppContext = {
    todos: mockTodos,
    loading: false,
    error: null,
    addTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    addNotification: jest.fn(),
  };

  beforeEach(() => {
    mockUseApp.mockReturnValue(mockAppContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return todos and basic functionality', () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.addTodo).toBe('function');
    expect(typeof result.current.updateTodo).toBe('function');
    expect(typeof result.current.deleteTodo).toBe('function');
  });

  it('should filter todos by priority', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateFilters({ priority: 'high' });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].priority).toBe('high');
  });

  it('should filter todos by status', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateFilters({ status: 'completed' });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].completed).toBe(true);
  });

  it('should search todos by title', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateFilters({ search: 'Test Todo 1' });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test Todo 1');
  });

  it('should sort todos by priority', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateFilters({ sortBy: 'priority', sortOrder: 'desc' });
    });

    expect(result.current.todos[0].priority).toBe('high');
    expect(result.current.todos[1].priority).toBe('low');
  });

  it('should calculate correct statistics', () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.completed).toBe(1);
    expect(result.current.stats.pending).toBe(1);
    expect(result.current.stats.highPriority).toBe(1);
    expect(result.current.stats.lowPriority).toBe(1);
  });

  it('should clear filters', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.updateFilters({ priority: 'high' });
    });

    expect(result.current.todos).toHaveLength(1);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.filters.priority).toBe('all');
  });

  it('should call updateTodo when toggleComplete is called', async () => {
    const { result } = renderHook(() => useTodos());
    const todo = mockTodos[0];

    await act(async () => {
      await result.current.toggleComplete(todo);
    });

    expect(mockAppContext.updateTodo).toHaveBeenCalledWith('1', { completed: true });
  });
});
