import { forwardRef, useRef } from 'react';
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
import { hapticsImpact } from '../utils';

export function Pressable({
  children,
  style,
  scaleValue = 1,
  isLoading = false,
  color = '#000000',
  haptics = false,
  ...props
}: PressableProps & {
  scaleValue?: number;
  isLoading?: boolean;
  color?: string;
  haptics?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
    }).start();

    if (haptics) {
      hapticsImpact();
    }
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

export const TextInput = forwardRef<DefaultTextInput, TextInputProps>(
  (props, ref) => {
    return (
      <DefaultTextInput
        ref={ref}
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
          ...props.style,
        }}
      />
    );
  },
);
