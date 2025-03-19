# React Native Todo App

A React Native Todo application with NativeWind (Tailwind CSS) styling.

## Styling with NativeWind

This project uses NativeWind v4 for styling, which allows you to use Tailwind CSS classes directly in React Native components.

### Using Styled Components

To properly use Tailwind CSS classes in React Native, we've created styled wrappers in `src/utils/nativewind-styled.ts`:

```typescript
import { styled } from 'nativewind';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Pressable,
} from 'react-native';

// Basic Components
export const StyledView = styled(View);
export const StyledText = styled(Text);
export const StyledTouchableOpacity = styled(TouchableOpacity);
export const StyledTextInput = styled(TextInput);
export const StyledSafeAreaView = styled(SafeAreaView);
export const StyledScrollView = styled(ScrollView);
export const StyledFlatList = styled(FlatList);
export const StyledImage = styled(Image);
export const StyledPressable = styled(Pressable);
```

### How to Use Styled Components

Instead of using React Native's built-in components directly, use the styled versions:

```typescript
// ❌ Don't do this
import { View, Text } from 'react-native';

<View className="flex-1 p-4 bg-gray-100">
  <Text className="text-lg font-bold">Hello World</Text>
</View>

// ✅ Do this instead
import { StyledView, StyledText } from '../../utils/nativewind-styled';

<StyledView className="flex-1 p-4 bg-gray-100">
  <StyledText className="text-lg font-bold">Hello World</StyledText>
</StyledView>
```

### Important Note

React Native components don't have a `className` prop by default. Using the `styled` wrapper from NativeWind allows the components to accept a `className` prop with Tailwind CSS classes.

## Running the Application

```bash
# Install dependencies
npm install

# Start the application
npm start

# Run on Web
npm run web

# Run on iOS
npm run ios

# Run on Android
npm run android
```
