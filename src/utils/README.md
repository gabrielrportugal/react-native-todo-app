# NativeWind Styled Components

This directory contains the NativeWind styled components for the project.

## How to Use

1. Import the styled components from this utility file:
   ```typescript
   import { StyledView, StyledText, StyledTouchableOpacity } from '../../utils/nativewind-styled';
   ```

2. Replace regular React Native components with the styled versions:
   ```typescript
   // Instead of this:
   <View className="bg-white p-4">
     <Text className="text-lg">Hello World</Text>
   </View>

   // Use this:
   <StyledView className="bg-white p-4">
     <StyledText className="text-lg">Hello World</StyledText>
   </StyledView>
   ```

3. For styled components not included in the utility file, you can create your own:
   ```typescript
   import { styled } from 'nativewind';
   import { YourComponent } from './path-to-component';

   export const StyledYourComponent = styled(YourComponent);
   ```

This approach is necessary because of how NativeWind v4 integrates with TypeScript. The styled HOC properly maps the className prop to style props that React Native components understand.
