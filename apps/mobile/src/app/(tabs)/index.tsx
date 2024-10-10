import BottomSheet from '@gorhom/bottom-sheet';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Pressable as NativePressable } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AngleRight, Pause, Play, Stop } from '@/src/components/Icons';
import { Pressable, Text } from '@/src/components/Themed';
import {
  useActiveList,
  useFocusingTask,
  useTasks,
  useTasksActions,
} from '@/src/stores/useTasksStore';
import {
  useDisplayTime,
  useMode,
  useStatus,
  useTimerActions,
  useTotalTime,
} from '@/src/stores/useTimerStore';
import { formatTime } from '@/src/utils';

export default function TimerTab() {
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const status = useStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { startTimer, stopTimer, pauseTimer, resumeTimer } = useTimerActions();

  const tasks = useTasks();
  const focusingTask = useFocusingTask();
  const activeList = useActiveList();
  const { focusTask, unfocusTask } = useTasksActions();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert(
          'You need to enable notifications for this app to work properly.',
        );
      }
    })();
  }, []);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <AnimatedCircularProgress
          size={336}
          width={36}
          fill={
            mode === 'focus'
              ? 0
              : 100 * (displayTime / Math.floor(totalTime! / 1000))
          }
          rotation={0}
          tintColor="#DBBFFF"
          backgroundColor="#3F3E55"
          lineCap="round"
        >
          {() => (
            <View style={styles.timerContent}>
              <Text style={styles.mode}>
                {mode === 'focus' ? 'Focus' : 'Break'}
              </Text>
              <Text style={styles.time}>{formatTime(displayTime)}</Text>
              <NativePressable
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
                  <Text style={styles.focusingTaskText}>
                    {focusingTask ? focusingTask.name : 'Select a task'}
                  </Text>
                  <AngleRight />
                </View>
              </NativePressable>
            </View>
          )}
        </AnimatedCircularProgress>
        <View style={styles.buttonContainer}>
          {mode === 'focus' &&
            (status === 'running' || status === 'paused') && (
              <Pressable
                scaleValue={0.9}
                isLoading={isLoading}
                color="#FFFFFF"
                style={styles.button}
                onPress={async () => {
                  setIsLoading(true);
                  if (status === 'running') {
                    await pauseTimer(focusingTask, activeList);
                  } else {
                    await resumeTimer();
                  }
                  setIsLoading(false);
                }}
              >
                {status === 'running' ? <Pause /> : <Play />}
              </Pressable>
            )}
          <Pressable
            scaleValue={0.9}
            isLoading={isLoading}
            color="#FFFFFF"
            style={styles.button}
            onPress={async () => {
              setIsLoading(true);
              if (status !== 'idle') {
                await stopTimer(focusingTask, activeList);
              } else {
                await startTimer();
              }
              setIsLoading(false);
            }}
          >
            {status === 'idle' ? <Play /> : <Stop />}
          </Pressable>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%']}
        backgroundStyle={styles.bottomSheetBackground}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: '#3F3E55' }}
      >
        <Pressable
          style={styles.removeTaskButton}
          onPress={() => {
            unfocusTask();
            bottomSheetRef.current?.close();
          }}
        >
          <Text style={styles.removeTaskButtonText}>Clear Focusing Task</Text>
        </Pressable>
        <FlatList
          data={tasks}
          renderItem={renderPickerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.pickerContainer}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
  bottomSheetBackground: {
    backgroundColor: '#1E1D2F',
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
