import { LogsWithTasks } from '@/utils/stats/calculateTaskTime';

/* eslint-disable no-restricted-syntax */
export default function calculateFocusTimes(sessions: LogsWithTasks[]): {
  totalFocusTime: number;
  longestFocusTime: number;
} {
  let totalFocusTime = 0; // in minutes
  let longestFocusTime = 0; // in minutes

  for (const session of sessions) {
    if (session.mode === 'focus') {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      const duration = (end.getTime() - start.getTime()) / 60000;

      totalFocusTime += duration;

      if (duration > longestFocusTime) {
        longestFocusTime = duration;
      }
    }
  }

  return {
    totalFocusTime,
    longestFocusTime,
  };
}
