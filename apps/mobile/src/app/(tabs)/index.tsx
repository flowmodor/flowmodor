import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Pause, Play, Stop } from '@/src/components/Icons';
import { Pressable, Text } from '@/src/components/Themed';
import {
  useDisplayTime,
  useMode,
  useStatus,
  useTimerActions,
  useTotalTime,
} from '@/src/stores/useTimerStore';
import { formatTime } from '@/src/utils';

export default function App() {
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const status = useStatus();

  const { startTimer, stopTimer, pauseTimer, resumeTimer } = useTimerActions();

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

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={320}
        width={40}
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
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.time}>{formatTime(displayTime)}</Text>
            <Text style={styles.mode}>
              {mode === 'focus' ? 'Focus' : 'Break'}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
        }}
      >
        {mode === 'focus' && (status === 'running' || status === 'paused') && (
          <Pressable
            style={styles.button}
            onPress={async () => {
              if (status === 'running') {
                await pauseTimer();
              } else {
                await resumeTimer();
              }
            }}
          >
            {status === 'running' ? <Pause /> : <Play />}
          </Pressable>
        )}
        <Pressable
          style={styles.button}
          onPress={async () => {
            if (status !== 'idle') {
              await stopTimer();
            } else {
              await startTimer();
            }
          }}
        >
          {status === 'idle' ? <Play /> : <Stop />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131221',
    gap: 40,
    paddingTop: 40,
  },
  time: {
    fontSize: 52,
    fontWeight: 'bold',
  },
  mode: {
    fontSize: 28,
    fontWeight: 'bold',
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
