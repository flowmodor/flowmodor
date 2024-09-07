import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable as DefaultPressable,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  PressableProps,
  TextInputProps,
  TextProps,
} from 'react-native';

export function Pressable({
  children,
  style,
  scaleValue = 1,
  isLoading = false,
  color = '#000000',
  ...props
}: PressableProps & {
  scaleValue?: number;
  isLoading?: boolean;
  color?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <DefaultPressable
        {...props}
        style={[
          {
            borderRadius: 8,
            backgroundColor: '#DBBFFF',
            padding: 10,
          },
          style,
        ]}
        disabled={isLoading}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {isLoading ? <ActivityIndicator color={color} /> : children}
      </DefaultPressable>
    </Animated.View>
  );
}

export function Text({ style, ...props }: TextProps) {
  return <DefaultText {...props} style={[{ color: '#ffffff' }, style]} />;
}

export function TextInput({ ...props }: TextInputProps) {
  return (
    <DefaultTextInput
      {...props}
      placeholderTextColor="#ffffff70"
      autoCapitalize="none"
      style={{
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        borderColor: '#3F3E55',
        color: '#ffffff',
        borderWidth: 2,
      }}
    />
  );
}
