import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/presentation/screens/HomeScreen';
import { TodoProvider } from './src/application/contexts/TodoContext';
import { AsyncStorageTodoRepository } from './src/infrastructure/repositories/AsyncStorageTodoRepository';

// Create our stack navigator
const Stack = createNativeStackNavigator();

// Initialize the repository
const todoRepository = new AsyncStorageTodoRepository();

export default function App() {
  return (
    <SafeAreaProvider>
      <TodoProvider repository={todoRepository}>
        <NavigationContainer>
          <Stack.Navigator
            id={undefined}
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#f8fafc', // tailwind slate-50
              },
              headerTintColor: '#334155', // tailwind slate-700
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{
                title: 'To-Do List',
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </TodoProvider>
    </SafeAreaProvider>
  );
}
