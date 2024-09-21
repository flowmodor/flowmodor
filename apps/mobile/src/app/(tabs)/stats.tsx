import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScheduleChart from '@/src/components/ScheduleChart';
import { useStatsActions } from '@/src/stores/useStatsStore';

export default function Stats() {
  const insets = useSafeAreaInsets();
  const { updateLogs } = useStatsActions();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#131221',
        paddingTop: insets.top,
      }}
    >
      <ScheduleChart />
    </View>
  );
}
