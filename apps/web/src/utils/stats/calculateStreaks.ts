interface FocusTimeData {
  date: string;
  count: number;
  level: number;
}

interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

// eslint-disable-next-line import/prefer-default-export
export function calculateStreaks(data: FocusTimeData[]): StreakResult {
  if (data.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedData = data
    .filter((item) => item.level >= 1)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const streaks: number[] = [];
  let streakCount = 1;
  let previousDate = new Date(sortedData[0].date);

  for (let i = 1; i < sortedData.length; i += 1) {
    const currentDate = new Date(sortedData[i].date);
    const dayDifference = Math.floor(
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayDifference === 1) {
      streakCount += 1;
    } else {
      streaks.push(streakCount);
      streakCount = 1;
    }
    previousDate = currentDate;
  }
  streaks.push(streakCount);

  const longestStreak = Math.max(...streaks);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastRecordDate = new Date(sortedData[sortedData.length - 1].date);
  lastRecordDate.setHours(0, 0, 0, 0);

  const daysSinceLastRecord = Math.floor(
    (today.getTime() - lastRecordDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const currentStreak =
    daysSinceLastRecord <= 1 ? streaks[streaks.length - 1] : 0;

  return { currentStreak, longestStreak };
}
