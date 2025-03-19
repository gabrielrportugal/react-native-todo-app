import React, { useState, useMemo } from 'react';
import { FlatList, View as RNView } from 'react-native';
import { useTodoContext } from '../../application/contexts/TodoContext';
import { TodoItemComponent } from './TodoItem';
import { TodoItem as TodoItemType, TodoPriority } from '../../domain/entities/TodoItem';
import { format } from 'date-fns';
import { 
  StyledView, 
  StyledText, 
  StyledTouchableOpacity, 
  StyledFlatList 
} from '../../utils/nativewind-styled';

type FilterOption = 'all' | 'active' | 'completed';
type SortOption = 'priority' | 'date';

const TodoList: React.FC = () => {
  const { todos, updateTodo, deleteTodo } = useTodoContext();
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const filteredAndSortedTodos = useMemo(() => {
    // First, filter todos based on the selected filter
    let filteredTodos: TodoItemType[] = [];
    
    switch (filter) {
      case 'all':
        filteredTodos = [...todos];
        break;
      case 'active':
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
        filteredTodos = [...todos];
    }

    // Then, sort the filtered todos based on the selected sort option
    return filteredTodos.sort((a, b) => {
      if (sortBy === 'priority') {
        // Sort by priority (higher priority first)
        // Convert string enum to numeric priority
        const priorityValues = {
          [TodoPriority.HIGH]: 3,
          [TodoPriority.MEDIUM]: 2,
          [TodoPriority.LOW]: 1
        };
        return priorityValues[b.priority] - priorityValues[a.priority];
      } else {
        // Sort by due date (earlier dates first)
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });
  }, [todos, filter, sortBy]);

  const renderFilterButton = (option: FilterOption, label: string) => (
    <StyledTouchableOpacity
      className={`px-3 py-1 rounded-full mr-2 ${filter === option ? 'bg-blue-500' : 'bg-gray-200'}`}
      onPress={() => setFilter(option)}
    >
      <StyledText className={`text-sm ${filter === option ? 'text-white' : 'text-gray-800'}`}>
        {label}
      </StyledText>
    </StyledTouchableOpacity>
  );

  const renderSortButton = (option: SortOption, label: string) => (
    <StyledTouchableOpacity
      className={`px-3 py-1 rounded-full mr-2 ${sortBy === option ? 'bg-purple-500' : 'bg-gray-200'}`}
      onPress={() => setSortBy(option)}
    >
      <StyledText className={`text-sm ${sortBy === option ? 'text-white' : 'text-gray-800'}`}>
        {label}
      </StyledText>
    </StyledTouchableOpacity>
  );

  return (
    <StyledView className="flex-1 p-4">
      <StyledView className="mb-4">
        <StyledText className="text-lg font-bold mb-2">Filters</StyledText>
        <StyledView className="flex-row mb-2">
          {renderFilterButton('all', 'All')}
          {renderFilterButton('active', 'Active')}
          {renderFilterButton('completed', 'Completed')}
        </StyledView>
        
        <StyledText className="text-lg font-bold mb-2">Sort By</StyledText>
        <StyledView className="flex-row">
          {renderSortButton('priority', 'Priority')}
          {renderSortButton('date', 'Due Date')}
        </StyledView>
      </StyledView>

      {filteredAndSortedTodos.length > 0 ? (
        <StyledFlatList
          data={filteredAndSortedTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItemComponent 
              item={item}
              onToggleComplete={(id) => updateTodo(id, { completed: !item.completed })}
              onDelete={deleteTodo}
              onViewDetails={(todo) => {
                // Implement view details functionality
                // This could open a modal or navigate to a details screen
                console.log('View details for todo:', todo);
              }}
            />
          )}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          ItemSeparatorComponent={() => <StyledView className="h-2" />}
        />
      ) : (
        <StyledView className="flex-1 items-center justify-center">
          <StyledText className="text-gray-500 text-lg">No todos found</StyledText>
          <StyledText className="text-gray-400 text-sm mt-1">
            {filter === 'all'
              ? 'Add a new todo to get started'
              : filter === 'active'
              ? 'No active todos found'
              : 'No completed todos found'}
          </StyledText>
        </StyledView>
      )}

      <StyledView className="mt-4 border-t border-gray-200 pt-2">
        <StyledText className="text-gray-500 text-sm">
          {filteredAndSortedTodos.length} {filteredAndSortedTodos.length === 1 ? 'todo' : 'todos'} 
          {filter !== 'all' ? ` (${filter})` : ''}
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default TodoList;
