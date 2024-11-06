import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Pause, Play, Stop } from '@/src/components/Icons';
import TaskSelector from '@/src/components/TaskSelector';
import { Pressable, Text } from '@/src/components/Themed';
import { useActiveList, useFocusingTask } from '@/src/stores/useTasksStore';
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

  const focusingTask = useFocusingTask();
  const activeList = useActiveList();

  return (
    <>
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
              {mode === 'focus' && <TaskSelector />}
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
    </>
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
});
