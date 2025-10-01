// User and Authentication Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// Todo Types
export interface Todo {
  id?: string;
  todoId?: string;
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TodoFormData {
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  completed: boolean;
}

// Context Types
export interface AppState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  user: User | null;
  userProfile: UserProfile | null;
}

export interface AppContextType extends AppState {
  addTodo: (todoData: TodoFormData) => Promise<void>;
  updateTodo: (todoId: string, todoData: Partial<TodoFormData>) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  addNotification: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
  clearError: () => void;
  setUserProfile: (profile: UserProfile) => void;
}

export interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// Component Props Types
export interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, todo: Todo) => void;
}

export interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (todoData: TodoFormData) => void;
  editingTodo?: Todo | null;
  loading?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

// Notification Types
export interface Notification {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
  read: boolean;
}

// Filter and Search Types
export interface TodoFilters {
  priority: 'all' | 'low' | 'medium' | 'high';
  status: 'all' | 'completed' | 'pending';
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

// Theme Types
export interface Theme {
  palette: {
    mode: 'light' | 'dark';
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Hook Return Types
export interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (todoData: TodoFormData) => Promise<void>;
  updateTodo: (todoId: string, todoData: Partial<TodoFormData>) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Utility Types
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'completed' | 'pending';
export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';
export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';
