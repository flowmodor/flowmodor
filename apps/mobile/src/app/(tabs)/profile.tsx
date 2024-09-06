import { View } from 'react-native';
import { Text } from '@/src/components/Themed';

export default function Profile() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#131221',
      }}
    >
      <Text>Profile</Text>
    </View>
  );
}
