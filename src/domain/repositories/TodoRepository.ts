import { TodoItem } from '../entities/TodoItem';

/**
 * Interface defining the contract for Todo item repository operations
 */
export interface TodoRepository {
  /**
   * Get all todo items
   * @returns Promise resolving to an array of todo items
   */
  getAllTodos(): Promise<TodoItem[]>;
  
  /**
   * Get a specific todo item by its ID
   * @param id Unique identifier of the todo item
   * @returns Promise resolving to the todo item or null if not found
   */
  getTodoById(id: string): Promise<TodoItem | null>;
  
  /**
   * Create a new todo item
   * @param todoItem Todo item to create (without id)
   * @returns Promise resolving to the created todo item with assigned ID
   */
  createTodo(todoItem: Omit<TodoItem, 'id'>): Promise<TodoItem>;
  
  /**
   * Update an existing todo item
   * @param id Unique identifier of the todo item to update
   * @param todoItem Updated todo item data
   * @returns Promise resolving to the updated todo item or null if not found
   */
  updateTodo(id: string, todoItem: Partial<Omit<TodoItem, 'id'>>): Promise<TodoItem | null>;
  
  /**
   * Delete a todo item by its ID
   * @param id Unique identifier of the todo item to delete
   * @returns Promise resolving to true if deleted successfully, false otherwise
   */
  deleteTodo(id: string): Promise<boolean>;
  
  /**
   * Get todo items filtered by completion status
   * @param completed Whether to get completed or incomplete items
   * @returns Promise resolving to an array of filtered todo items
   */
  getTodosByCompletionStatus(completed: boolean): Promise<TodoItem[]>;
  
  /**
   * Search for todo items by title or description
   * @param searchTerm Term to search for in title or description
   * @returns Promise resolving to an array of matching todo items
   */
  searchTodos(searchTerm: string): Promise<TodoItem[]>;
}

