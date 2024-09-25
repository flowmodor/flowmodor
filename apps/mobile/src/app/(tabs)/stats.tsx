import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Left, Right } from '@/src/components/Icons';
import ScheduleChart from '@/src/components/ScheduleChart';
import { Pressable, Text } from '@/src/components/Themed';
import { useSession } from '@/src/ctx';
import { useDisplayTime, useStatsActions } from '@/src/stores/useStatsStore';

export default function Stats() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const displayTime = useDisplayTime();
  const { goPreviousTime, goNextTime } = useStatsActions();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#131221',
        paddingTop: insets.top + 10,
        gap: 20,
      }}
    >
      <View style={styles.header}>
        {session && (
          <Pressable
            scaleValue={0.9}
            style={{
              backgroundColor: '#3F3E55',
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={goPreviousTime}
          >
            <Left />
          </Pressable>
        )}
        <Text style={styles.displayTime}>
          {session ? displayTime : 'Sign in to save focus history'}
        </Text>
        {session && (
          <Pressable
            scaleValue={0.9}
            style={{
              backgroundColor: '#3F3E55',
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={goNextTime}
          >
            <Right />
          </Pressable>
        )}
      </View>
      <ScheduleChart />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  displayTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});