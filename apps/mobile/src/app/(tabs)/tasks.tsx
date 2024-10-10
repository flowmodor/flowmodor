import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Up } from '@/src/components/Icons';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';
import { useTasks, useTasksActions } from '@/src/stores/useTasksStore';

export default function Stats() {
  const insets = useSafeAreaInsets();
  const tasks = useTasks();
  const { completeTask, addTask } = useTasksActions();
  const [newTaskName, setNewTaskName] = useState('');
  const { session } = useSession();

  const renderTask = ({ item }: { item: any }) => (
    <View style={styles.taskContainer}>
      <BouncyCheckbox
        size={25}
        fillColor="#DBBFFF"
        disableText
        iconStyle={{ borderColor: '#DBBFFF' }}
        innerIconStyle={{ borderWidth: 1 }}
        textStyle={{ color: '#FFFFFF' }}
        onPress={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await completeTask(item);
        }}
        isChecked={item.completed}
      />
      <Text
        style={{
          fontSize: 16,
        }}
      >
        {item.name}
      </Text>
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
      {session === null && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          Sign in to save tasks
        </Text>
      )}
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
          onSubmitEditing={handleAddTask}
          blurOnSubmit={false}
          placeholder="Add a new task"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <Pressable
          style={[
            styles.addButton,
            !newTaskName.trim() && styles.addButtonDisabled,
          ]}
          onPress={handleAddTask}
          disabled={!newTaskName.trim()}
        >
          <Up />
        </Pressable>
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
    borderTopWidth: 1,
  },
  taskContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#3F3E55',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
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
    backgroundColor: '#DBBFFF',
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
