import React, { useState } from 'react';
import { Modal, Platform } from 'react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { TodoItem, TodoPriority } from '../../domain/entities/TodoItem';
import { useTodoContext } from '../../application/contexts/TodoContext';
import { 
  StyledView, 
  StyledText, 
  StyledTextInput, 
  StyledTouchableOpacity, 
  StyledScrollView 
} from '../../utils/nativewind-styled';

type AddTodoFormProps = {
  onClose?: () => void;
  isModal?: boolean;
};

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onClose, isModal = false }) => {
  const { addTodo } = useTodoContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const priorityOptions = [
    { label: 'Low', value: TodoPriority.LOW },
    { label: 'Medium', value: TodoPriority.MEDIUM },
    { label: 'High', value: TodoPriority.HIGH },
  ];

  const validateForm = (): boolean => {
    const newErrors: { title?: string; dueDate?: string } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (dueDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.dueDate = 'Due date cannot be in the past';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newTodo: Omit<TodoItem, 'id'> = {
        title,
        description,
        dueDate,
        priority,
        createdAt: new Date(),
        updatedAt: null,
        completed: false,
      };

      addTodo(newTodo);
      resetForm();
      if (onClose) {
        onClose();
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setPriority(TodoPriority.MEDIUM);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const renderContent = () => (
    <StyledScrollView className="flex-1 px-4 py-6">
      <StyledText className="text-lg font-bold mb-6 text-center">Add New Todo</StyledText>

      <StyledView className="mb-4">
        <StyledText className="font-semibold mb-1">Title *</StyledText>
        <StyledTextInput
          className={`bg-white border p-2 rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter todo title"
        />
        {errors.title && <StyledText className="text-red-500 text-xs mt-1">{errors.title}</StyledText>}
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="font-semibold mb-1">Description</StyledText>
        <StyledTextInput
          className="bg-white border border-gray-300 p-2 rounded-md h-20"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          textAlignVertical="top"
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="font-semibold mb-1">Due Date *</StyledText>
        <StyledTouchableOpacity
          className={`bg-white border p-2 rounded-md flex-row items-center justify-between ${
            errors.dueDate ? 'border-red-500' : 'border-gray-300'
          }`}
          onPress={() => setShowDatePicker(true)}
        >
          <StyledText>{format(dueDate, 'PPP')}</StyledText>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </StyledTouchableOpacity>
        {errors.dueDate && <StyledText className="text-red-500 text-xs mt-1">{errors.dueDate}</StyledText>}
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </StyledView>

      <StyledView className="mb-6">
        <StyledText className="font-semibold mb-2">Priority</StyledText>
        <StyledView className="flex-row justify-between">
          {priorityOptions.map((option) => (
            <StyledTouchableOpacity
              key={option.value}
              className={`flex-1 py-2 mx-1 items-center rounded-md ${
                priority === option.value
                  ? option.value === TodoPriority.LOW
                    ? 'bg-green-500'
                    : option.value === TodoPriority.MEDIUM
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                  : 'bg-gray-200'
              }`}
              onPress={() => setPriority(option.value)}
            >
              <StyledText className={`font-medium ${priority === option.value ? 'text-white' : 'text-gray-700'}`}>
                {option.label}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      </StyledView>

      <StyledView className="flex-row justify-end mt-4">
        {isModal && (
          <StyledTouchableOpacity
            className="bg-gray-300 px-6 py-2 rounded-md mr-2"
            onPress={onClose}
          >
            <StyledText className="font-semibold">Cancel</StyledText>
          </StyledTouchableOpacity>
        )}
        <StyledTouchableOpacity
          className="bg-blue-500 px-6 py-2 rounded-md"
          onPress={handleSubmit}
        >
          <StyledText className="text-white font-semibold">Add Todo</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledScrollView>
  );

  if (isModal) {
    return (
      <Modal animationType="slide" transparent visible onRequestClose={onClose}>
        <StyledView className="flex-1 justify-center bg-black/50">
          <StyledView className="bg-gray-100 m-4 rounded-lg max-h-[90%]">
            {renderContent()}
          </StyledView>
        </StyledView>
      </Modal>
    );
  }

  return renderContent();
};

export default AddTodoForm;
