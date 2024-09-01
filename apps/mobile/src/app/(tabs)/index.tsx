import { StyleSheet, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Hide, Pause, Play, Show, Stop } from '@/src/components/Icons';
import { Pressable, Text } from '@/src/components/Themed';
import useTick from '@/src/hooks/useTick';
import {
  useDisplayTime,
  useMode,
  useShowTime,
  useStatus,
  useTimerActions,
  useTotalTime,
} from '@/src/stores/useTimerStore';
import { formatTime } from '@/src/utils';

export default function TabOneScreen() {
  const totalTime = useTotalTime();
  const displayTime = useDisplayTime();
  const mode = useMode();
  const status = useStatus();
  const showTime = useShowTime();

  const { startTimer, stopTimer, pauseTimer, resumeTimer, toggleShowTime } =
    useTimerActions();

  useTick();

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
            <Text style={styles.time}>
              {showTime && formatTime(displayTime)}
            </Text>
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
          gap: 20,
        }}
      >
        <Pressable style={styles.button} onPress={toggleShowTime}>
          {showTime ? <Hide /> : <Show />}
        </Pressable>
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
    gap: 20,
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
    width: 42,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
