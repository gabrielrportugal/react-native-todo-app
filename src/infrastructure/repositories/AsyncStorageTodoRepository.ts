import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { TodoItem, TodoPriority } from '../../domain/entities/TodoItem';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

/**
 * Implementation of TodoRepository using AsyncStorage for persistence
 */
export class AsyncStorageTodoRepository implements TodoRepository {
  private readonly STORAGE_KEY = 'todos';

  /**
   * Transforms an object from storage to a TodoItem with proper Date objects
   */
  private parseTodoItem(item: any): TodoItem {
    return {
      ...item,
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
      createdAt: new Date(item.createdAt),
    };
  }

  /**
   * Retrieves all todo items from storage
   */
  private async loadTodosFromStorage(): Promise<TodoItem[]> {
    try {
      const todosJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!todosJson) {
        return [];
      }
      
      const todos = JSON.parse(todosJson);
      return todos.map(this.parseTodoItem);
    } catch (error) {
      console.error('Failed to retrieve todos from storage:', error);
      throw new Error('Failed to retrieve todos from storage');
    }
  }

  /**
   * Saves all todo items to storage
   */
  private async saveTodos(todos: TodoItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to storage:', error);
      throw new Error('Failed to save todos to storage');
    }
  }
  /**
   * Creates a new TodoItem with a unique ID and current timestamp
   */
  async createTodo(todoItem: Omit<TodoItem, 'id'>): Promise<TodoItem> {
    try {
      const todos = await this.loadTodosFromStorage();
      
      const newTodo: TodoItem = {
        ...todoItem,
        id: uuidv4(),
        createdAt: new Date(),
        completed: todoItem.completed || false,
        priority: todoItem.priority || TodoPriority.MEDIUM,
      };
      
      todos.push(newTodo);
      await this.saveTodos(todos);
      
      return newTodo;
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw new Error('Failed to create todo');
    }
  }
  /**
   * Retrieves a TodoItem by its ID
   */
  async getTodoById(id: string): Promise<TodoItem | null> {
    try {
      const todos = await this.loadTodosFromStorage();
      const todo = todos.find(item => item.id === id);
      
      return todo || null;
    } catch (error) {
      console.error(`Failed to get todo with id ${id}:`, error);
      throw new Error(`Failed to get todo with id ${id}`);
    }
  }
  /**
   * Updates an existing TodoItem
   */
  async updateTodo(id: string, todoItem: Partial<Omit<TodoItem, 'id'>>): Promise<TodoItem | null> {
    try {
      const todos = await this.loadTodosFromStorage();
      const index = todos.findIndex(item => item.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updatedTodo: TodoItem = {
        ...todos[index],
        ...todoItem,
        updatedAt: new Date(),
      };
      
      todos[index] = updatedTodo;
      await this.saveTodos(todos);
      
      return updatedTodo;
    } catch (error) {
      console.error(`Failed to update todo with id ${id}:`, error);
      throw new Error(`Failed to update todo with id ${id}`);
    }
  }
  /**
   * Deletes a TodoItem by its ID
   */
  async deleteTodo(id: string): Promise<boolean> {
    try {
      const todos = await this.loadTodosFromStorage();
      const initialLength = todos.length;
      
      const filteredTodos = todos.filter(item => item.id !== id);
      
      if (filteredTodos.length === initialLength) {
        return false;
      }
      
      await this.saveTodos(filteredTodos);
      return true;
    } catch (error) {
      console.error(`Failed to delete todo with id ${id}:`, error);
      throw new Error(`Failed to delete todo with id ${id}`);
    }
  }
  /**
   * Lists all TodoItems
   */
  async getAllTodos(): Promise<TodoItem[]> {
    try {
      return await this.loadTodosFromStorage();
    } catch (error) {
      console.error('Failed to list todos:', error);
      throw new Error('Failed to list todos');
    }
  }
  /**
   * Lists TodoItems filtered by completion status
   */
  async getTodosByCompletionStatus(completed: boolean): Promise<TodoItem[]> {
    try {
      const todos = await this.loadTodosFromStorage();
      return todos.filter(item => item.completed === completed);
    } catch (error) {
      console.error(`Failed to list todos by status (completed=${completed}):`, error);
      throw new Error(`Failed to list todos by status (completed=${completed})`);
    }
  }

  /**
   * Searches TodoItems by title, description or priority
   */
  async searchTodos(query: string): Promise<TodoItem[]> {
    try {
      const todos = await this.loadTodosFromStorage();
      const searchTermLower = query.toLowerCase();
      
      return todos.filter(item => 
        item.title.toLowerCase().includes(searchTermLower) ||
        (item.description && item.description.toLowerCase().includes(searchTermLower)) ||
        item.priority.toLowerCase().includes(searchTermLower)
      );
    } catch (error) {
      console.error(`Failed to search todos with query "${query}":`, error);
      throw new Error(`Failed to search todos with query "${query}"`);
    }
  }
}
