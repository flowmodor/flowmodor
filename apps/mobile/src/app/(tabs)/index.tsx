import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
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

const REM = PixelRatio.get() > 2 ? 12 : 18;

export default function App() {
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const status = useStatus();
  const [isLoading, setIsLoading] = useState(false);

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
        size={28 * REM}
        width={3 * REM}
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
            scaleValue={0.9}
            isLoading={isLoading}
            color="#FFFFFF"
            style={styles.button}
            onPress={async () => {
              setIsLoading(true);
              if (status === 'running') {
                await pauseTimer();
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
              await stopTimer();
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
    fontSize: REM * 4,
    fontWeight: 'bold',
  },
  mode: {
    fontSize: REM * 2.5,
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
