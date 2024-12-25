import { LogsWithTasks } from '@flowmodor/types';

// eslint-disable-next-line import/prefer-default-export
export function calculateFocusTime(sessions: LogsWithTasks[]): {
  totalFocusTime: number;
  longestFocusTime: number;
} {
  let totalFocusTime = 0; // in minutes
  let longestFocusTime = 0; // in minutes

  // eslint-disable-next-line no-restricted-syntax
  for (const session of sessions) {
    const start = new Date(session.start_time);
    const end = new Date(session.end_time);
    const duration = (end.getTime() - start.getTime()) / 60000;

    totalFocusTime += duration;

    if (duration > longestFocusTime) {
      longestFocusTime = duration;
    }
  }

  return {
    totalFocusTime,
    longestFocusTime,
  };
}
