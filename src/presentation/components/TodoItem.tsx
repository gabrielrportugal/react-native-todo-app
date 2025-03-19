import React from 'react';
import { Alert } from 'react-native';
import { TodoItem } from '../../domain/entities/TodoItem';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { 
  StyledView, 
  StyledText, 
  StyledTouchableOpacity 
} from '../../utils/nativewind-styled';

interface TodoItemProps {
  item: TodoItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (item: TodoItem) => void;
}

export const TodoItemComponent: React.FC<TodoItemProps> = ({
  item,
  onToggleComplete,
  onDelete,
  onViewDetails,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => onDelete(item.id), 
          style: 'destructive' 
        },
      ]
    );
  };

  const priorityColors = {
    high: 'bg-red-100 border-red-400',
    medium: 'bg-yellow-100 border-yellow-400',
    low: 'bg-green-100 border-green-400',
  };

  const priorityColor = item.priority ? priorityColors[item.priority] : 'bg-gray-100 border-gray-300';

  return (
    <StyledView className={`flex-row items-center p-4 mb-2 rounded-lg border ${priorityColor}`}>
      <StyledTouchableOpacity
        onPress={() => onToggleComplete(item.id)}
        className="mr-3"
      >
        <StyledView className={`h-6 w-6 rounded-full border border-gray-400 items-center justify-center ${item.completed ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}>
          {item.completed && <Feather name="check" size={16} color="white" />}
        </StyledView>
      </StyledTouchableOpacity>

      <StyledView className="flex-1">
        <StyledText 
          className={`text-base font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
          numberOfLines={1}
        >
          {item.title}
        </StyledText>
        
        {item.dueDate && (
          <StyledText className="text-xs text-gray-500 mt-1">
            Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
          </StyledText>
        )}
      </StyledView>
      
      <StyledView className="flex-row items-center">
        <StyledTouchableOpacity
          onPress={() => onViewDetails(item)}
          className="p-2"
          accessibilityLabel="View todo details"
        >
          <Feather name="info" size={18} color="#4B5563" />
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity
          onPress={handleDelete}
          className="p-2 ml-1"
          accessibilityLabel="Delete todo"
        >
          <Feather name="trash-2" size={18} color="#EF4444" />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default TodoItemComponent;
