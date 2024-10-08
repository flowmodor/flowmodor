import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Up } from '@/src/components/Icons';
import { useTasks, useTasksActions } from '@/src/stores/useTasksStore';

export default function Stats() {
  const insets = useSafeAreaInsets();
  const tasks = useTasks();
  const { fetchTasks, completeTask, addTask } = useTasksActions();
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderTask = ({ item }: { item: any }) => (
    <View style={styles.taskContainer}>
      <BouncyCheckbox
        size={25}
        fillColor="#DBBFFF"
        text={item.name}
        iconStyle={{ borderColor: '#DBBFFF' }}
        innerIconStyle={{ borderWidth: 1 }}
        textStyle={{ color: '#FFFFFF' }}
        onPress={async () => {
          await completeTask(item);
        }}
        isChecked={item.completed}
      />
    </View>
  );

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim());
      setNewTaskName('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top + 10 }]}
    >
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTaskName}
          onChangeText={setNewTaskName}
          placeholder="Add a new task"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            !newTaskName.trim() && styles.addButtonDisabled,
          ]}
          onPress={handleAddTask}
          disabled={!newTaskName.trim()}
        >
          <Up />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131221',
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#3F3E55',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#3F3E55',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});
