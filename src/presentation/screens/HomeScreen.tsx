import React, { useState } from 'react';
import { TouchableOpacity as RNTouchableOpacity, Modal, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTodoContext } from '../../application/contexts/TodoContext';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import { 
  StyledView, 
  StyledText, 
  StyledTouchableOpacity, 
  StyledSafeAreaView 
} from '../../utils/nativewind-styled';

type HomeScreenProps = {
  navigation?: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();

  const handleOpenAddTodoModal = () => {
    setIsAddTodoModalVisible(true);
  };

  const handleCloseAddTodoModal = () => {
    setIsAddTodoModalVisible(false);
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      <StyledView className="flex-1 p-4">
        <StyledView className="flex-row justify-between items-center mb-4">
          <StyledText className="text-2xl font-bold text-gray-800">My Todo List</StyledText>
        </StyledView>

        {/* Todo List */}
        <TodoList />
      </StyledView>

      {/* Floating Action Button */}
      <StyledTouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={handleOpenAddTodoModal}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={30} color="white" />
      </StyledTouchableOpacity>

      {/* Add Todo Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddTodoModalVisible}
        onRequestClose={handleCloseAddTodoModal}
      >
        <StyledView className="flex-1 justify-end bg-black/50">
          <StyledView className="bg-white rounded-t-3xl p-5 h-4/5">
            <StyledView className="flex-row justify-between items-center mb-4">
              <StyledText className="text-xl font-bold text-gray-800">Add New Todo</StyledText>
              <StyledTouchableOpacity onPress={handleCloseAddTodoModal}>
                <AntDesign name="close" size={24} color="black" />
              </StyledTouchableOpacity>
            </StyledView>
            <AddTodoForm onClose={handleCloseAddTodoModal} isModal={true} />
          </StyledView>
        </StyledView>
      </Modal>
    </StyledSafeAreaView>
  );
};

export default HomeScreen;
