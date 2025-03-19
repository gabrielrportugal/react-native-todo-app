/**
 * Enum representing priority levels for a todo item
 */
export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Interface representing a Todo item
 */
export interface TodoItem {
  /**
   * Unique identifier for the todo item
   */
  id: string;
  
  /**
   * Title/name of the todo item
   */
  title: string;
  
  /**
   * Detailed description of the todo item
   */
  description: string;
  
  /**
   * Flag indicating whether the todo is completed
   */
  completed: boolean;
  
  /**
   * Date when the todo item was created
   */
  createdAt: Date;

    /**
   * Date when the todo item was updated
   */
  updatedAt: Date | null;
  
  /**
   * Date by which the todo item should be completed
   */
  dueDate: Date | null;
  
  /**
   * Priority level of the todo item
   */
  priority: TodoPriority;
}
