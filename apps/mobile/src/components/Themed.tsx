import {
  Pressable as DefaultPressable,
  Text as DefaultText,
  TextInput as DefaultTextInput,
  PressableProps,
  TextInputProps,
  TextProps,
} from 'react-native';

export function Pressable({ children, style, ...props }: PressableProps) {
  return (
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
    >
      {children}
    </DefaultPressable>
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
