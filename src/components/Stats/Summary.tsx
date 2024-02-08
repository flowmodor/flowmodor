import { ForwardedRef, forwardRef } from 'react';
import TimeFormatter from './TimeFormatter';

/* eslint-disable no-restricted-syntax */
interface Session {
  id: number;
  start_time: string;
  end_time: string;
  mode: string;
  user_id: string;
}

function calculateFocusTimes(sessions: Session[]): {
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

function Summary({ data }: { data: any[] }, ref: ForwardedRef<HTMLDivElement>) {
  const { totalFocusTime, longestFocusTime } = calculateFocusTimes(data);

  return (
    <div ref={ref} className="flex gap-10">
      <div className="flex flex-col items-center text-sm">
        Total Focus
        <TimeFormatter minutes={Math.round(totalFocusTime)} />
      </div>
      <div className="flex flex-col items-center text-sm">
        Longest Focus
        <TimeFormatter minutes={Math.round(longestFocusTime)} />
      </div>
    </div>
  );
}

export default forwardRef(Summary);
