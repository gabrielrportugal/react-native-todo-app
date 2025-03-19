import { TodoItem } from '../../domain/entities/TodoItem';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

/**
 * Use cases for managing TodoItems
 */
export class TodoUseCases {
  constructor(private repository: TodoRepository) {}

  /**
   * Adds a new TodoItem
   * @param todoData The todo data without id
   * @returns The created TodoItem with generated id
   */
  async addTodo(todoData: Omit<TodoItem, 'id'>): Promise<TodoItem> {
    return this.repository.createTodo(todoData);
  }

  /**
   * Updates an existing TodoItem
   * @param id The id of the todo to update
   * @param todoData The todo data to update
   * @returns The updated TodoItem or throws if not found
   */
  async updateTodo(id: string, todoData: Partial<Omit<TodoItem, 'id'>>): Promise<TodoItem> {
    const updatedTodo = await this.repository.updateTodo(id, todoData);
    if (!updatedTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    return updatedTodo;
  }

  /**
   * Deletes a TodoItem by id
   * @param id The id of the todo to delete
   * @returns True if the todo was deleted, false otherwise
   */
  async deleteTodo(id: string): Promise<boolean> {
    return this.repository.deleteTodo(id);
  }

  /**
   * Retrieves a TodoItem by id
   * @param id The id of the todo to retrieve
   * @returns The TodoItem or throws if not found
   */
  async getTodoById(id: string): Promise<TodoItem> {
    const todo = await this.repository.getTodoById(id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    return todo;
  }

  /**
   * Retrieves all TodoItems
   * @returns An array of all TodoItems
   */
  async getAllTodos(): Promise<TodoItem[]> {
    return this.repository.getAllTodos();
  }

  /**
   * Retrieves TodoItems filtered by completion status
   * @param completed Whether to return completed or incomplete todos
   * @returns An array of filtered TodoItems
   */
  async getTodosByStatus(completed: boolean): Promise<TodoItem[]> {
    return this.repository.getTodosByCompletionStatus(completed);
  }

  /**
   * Marks a TodoItem as completed
   * @param id The id of the todo to mark as completed
   * @returns The updated TodoItem
   */
  async markAsCompleted(id: string): Promise<TodoItem> {
    return this.updateTodo(id, { completed: true });
  }

  /**
   * Marks a TodoItem as incomplete
   * @param id The id of the todo to mark as incomplete
   * @returns The updated TodoItem
   */
  async markAsIncomplete(id: string): Promise<TodoItem> {
    return this.updateTodo(id, { completed: false });
  }
}

