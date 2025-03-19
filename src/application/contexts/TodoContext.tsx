import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TodoItem } from '../../domain/entities/TodoItem';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

// Define the shape of our context
interface TodoContextType {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  addTodo: (todo: Omit<TodoItem, 'id'>) => Promise<TodoItem>;
  updateTodo: (id: string, updates: Partial<TodoItem>) => Promise<TodoItem>;
  deleteTodo: (id: string) => Promise<void>;
  getTodo: (id: string) => Promise<TodoItem | null>;
  refreshTodos: () => Promise<void>;
}

// Create the context with default values
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Props for the provider component
interface TodoProviderProps {
  children: ReactNode;
  repository: TodoRepository;
}

// Provider component that will wrap our application
export const TodoProvider: React.FC<TodoProviderProps> = ({ children, repository }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos when the component mounts
  useEffect(() => {
    refreshTodos();
  }, []);

  // Fetch all todos from the repository
  const refreshTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTodos = await repository.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Failed to fetch todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (todo: Omit<TodoItem, 'id'>): Promise<TodoItem> => {
    try {
      setError(null);
      const newTodo = await repository.createTodo(todo);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add todo';
      setError(errorMessage);
      console.error('Failed to add todo:', err);
      throw new Error(errorMessage);
    }
  };

  // Update an existing todo
  const updateTodo = async (id: string, updates: Partial<TodoItem>): Promise<TodoItem> => {
    try {
      setError(null);
      const updatedTodo = await repository.updateTodo(id, updates);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      console.error('Failed to update todo:', err);
      throw new Error(errorMessage);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string): Promise<void> => {
    try {
      setError(null);
      await repository.deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      console.error('Failed to delete todo:', err);
      throw new Error(errorMessage);
    }
  };

  // Get a single todo by ID
  const getTodo = async (id: string): Promise<TodoItem | null> => {
    try {
      setError(null);
      return await repository.getTodoById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get todo';
      setError(errorMessage);
      console.error('Failed to get todo:', err);
      throw new Error(errorMessage);
    }
  };

  // Context value
  const value: TodoContextType = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodo,
    refreshTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

// Custom hook to use the todo context
export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;
