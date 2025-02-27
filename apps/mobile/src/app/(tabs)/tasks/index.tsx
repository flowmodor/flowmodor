import { Source } from '@flowmodor/task-sources';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Pressable as RNPressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/src/components/Themed';
import { useSources, useTasksActions } from '@/src/hooks/useTasks';

export default function SourcesScreen() {
  const insets = useSafeAreaInsets();
  const sources = useSources();
  const { onSourceChange } = useTasksActions();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: 'Sources',
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#131221',
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: 10,
        }}
      >
        Select Task Source
      </Text>
      {sources.map((source) => (
        <RNPressable
          key={source}
          onPress={() => {
            onSourceChange(source);
            if (source === Source.Flowmodor) {
              router.push(
                '/(tabs)/tasks/tasksList?listId=flowmodor&listName=Flowmodor',
              );
            } else {
              router.push('/(tabs)/tasks/lists');
            }
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#3F3E55',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: '#FFFFFF' }}>{source}</Text>
          </View>
        </RNPressable>
      ))}
    </View>
  );
}
