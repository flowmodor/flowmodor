import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Pressable, Text } from '@/src/components/Themed';
import { useBottomSheet } from '../context/BottomSheetContext';
import {
  useFocusingTask,
  useTasks,
  useTasksActions,
} from '../stores/useTasksStore';

const BottomSheetComponent = () => {
  const { bottomSheetRef } = useBottomSheet();
  const focusingTask = useFocusingTask();
  const { focusTask, unfocusTask } = useTasksActions();

  const tasks = useTasks();

  const renderPickerItem = ({ item }) => (
    <Pressable
      style={styles.pickerItem}
      onPress={() => {
        focusTask(item);
        bottomSheetRef.current?.close();
      }}
    >
      <Text style={styles.pickerItemText}>{item.name}</Text>
    </Pressable>
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['50%']}
      backgroundStyle={styles.bottomSheetBackground}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: '#3F3E55' }}
    >
      {focusingTask !== null && (
        <Pressable
          style={styles.removeTaskButton}
          onPress={() => {
            unfocusTask();
            bottomSheetRef.current?.close();
          }}
        >
          <Text style={styles.removeTaskButtonText}>Clear Focusing Task</Text>
        </Pressable>
      )}
      <FlatList
        data={tasks}
        renderItem={renderPickerItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.pickerContainer}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#1E1D2F',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131221',
    gap: 20,
    paddingTop: 40,
  },
  timerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  mode: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
  },
  button: {
    backgroundColor: '#3F3E55',
    width: 62,
    height: 62,
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusingTaskText: {
    color: '#FFFFFFA0',
    fontSize: 16,
    fontWeight: 600,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3E55',
  },
  removeTaskButton: {
    backgroundColor: '#3F3E55',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    paddingHorizontal: 20,
  },
  pickerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3E55',
    backgroundColor: 'transparent',
  },
  pickerItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default BottomSheetComponent;
