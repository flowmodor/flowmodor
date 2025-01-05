import { Pressable as NativePressable, StyleSheet, View } from 'react-native';
import { AngleRight } from '@/src/components/Icons';
import { Text } from '@/src/components/Themed';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import { useFocusingTask } from '../hooks/useTasks';
import { useStatus } from '../hooks/useTimer';

export default function TaskSelector() {
  const { bottomSheetRef } = useBottomSheet();
  const status = useStatus();
  const focusingTask = useFocusingTask();

  if (status === 'running' && !focusingTask) {
    return null;
  }

  return (
    <NativePressable
      disabled={status === 'running'}
      style={{
        marginTop: 6,
      }}
      onPress={() => bottomSheetRef.current?.expand()}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.focusingTaskText,
            focusingTask &&
              status !== 'running' &&
              styles.focusingTaskTextActive,
          ]}
        >
          {focusingTask ? focusingTask.name : 'Select a task'}
        </Text>
        <AngleRight
          fill={focusingTask && status !== 'running' ? '#FFFFFF' : '#FFFFFFA0'}
        />
      </View>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  focusingTaskText: {
    maxWidth: 180,
    color: '#FFFFFFA0',
    fontSize: 16,
    fontWeight: '600',
  },
  focusingTaskTextActive: {
    color: '#FFFFFF',
  },
});
