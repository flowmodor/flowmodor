import { useFocusEffect } from 'expo-router';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScheduleChart from '@/src/components/ScheduleChart';
import { Text } from '@/src/components/Themed';
import { useStartDate, useStatsActions } from '@/src/hooks/useStats';

const screenWidth = Dimensions.get('window').width;

export default function Stats() {
  const insets = useSafeAreaInsets();
  const selectedDate = useStartDate();
  const { updateLogs, setDate } = useStatsActions();
  const getWeekDaysFor = (offset: number) => {
    const baseDate = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - 6 + offset * 7 + i);
      return date;
    });
  };

  const weeks = [-4, -3, -2, -1, 0];

  useFocusEffect(() => {
    updateLogs();
  });

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
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekHeaderContainer}
          contentOffset={{ x: screenWidth * 4, y: 0 }}
        >
          {weeks.map((offset) => (
            <View style={styles.weekPage} key={offset.toString()}>
              {getWeekDaysFor(offset).map((day) => (
                <Pressable
                  key={day.toISOString()}
                  style={[
                    styles.dayButton,
                    selectedDate === day.toDateString() && {
                      backgroundColor: '#DBBFFF',
                    },
                  ]}
                  onPress={() => setDate(day)}
                >
                  <View style={styles.dayTextContainer}>
                    <Text
                      style={[
                        styles.weekdayText,
                        selectedDate === day.toDateString() && {
                          color: '#000',
                        },
                      ]}
                    >
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}
                    </Text>
                    <Text
                      style={[
                        styles.dateText,
                        selectedDate === day.toDateString() && {
                          color: '#000',
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      <ScheduleChart />
    </View>
  );
}

const styles = StyleSheet.create({
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  dayButton: {
    backgroundColor: '#3F3E55',
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  dayTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  weekHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekPage: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: screenWidth,
  },
});
