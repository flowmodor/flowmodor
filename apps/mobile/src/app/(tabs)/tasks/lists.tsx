import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Pressable as RNPressable } from 'react-native';
import { Text } from '@/src/components/Themed';
import {
  useActiveSource,
  useIsLoadingLists,
  useLists,
  useTasksActions,
} from '@/src/hooks/useTasks';

export default function ListsScreen() {
  const lists = useLists();
  const { onListChange } = useTasksActions();
  const isLoadingLists = useIsLoadingLists();
  const activeSource = useActiveSource();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: activeSource,
    });
  }, [navigation, activeSource]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#131221',
        paddingHorizontal: 20,
      }}
    >
      {isLoadingLists ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        lists.map((list) => (
          <RNPressable
            key={list.id}
            onPress={async () => {
              await onListChange(list.id);
              router.push(
                `/(tabs)/tasks/tasksList?listId=${list.id}&listName=${list.name}`,
              );
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
              <Text style={{ fontSize: 16, color: '#FFFFFF' }}>
                {list.name}
              </Text>
            </View>
          </RNPressable>
        ))
      )}
    </View>
  );
}
