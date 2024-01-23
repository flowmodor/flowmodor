const formatTime = (t: number) => {
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = t % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const validatePassword = (password: string) => /^$|^.{8,}$/.test(password);

const validateEmail = (email: string) =>
  /^$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
interface LogEntry {
  id: number;
  start_time: string;
  end_time: string;
  mode: 'focus' | 'break';
  user_id: string;
  task: number | null;
}

const processLogs = (logs: LogEntry[]) => {
  const entries = new Map<number, { focus: number; break: number }>();

  for (const log of logs) {
    let startTime = new Date(log.start_time);
    const endTime = new Date(log.end_time);

    while (startTime < endTime) {
      const hour = startTime.getHours();
      const nextHour = new Date(startTime.getTime());
      nextHour.setHours(hour + 1, 0, 0, 0); // Move to the start of the next hour

      const endOfPeriod = nextHour < endTime ? nextHour : endTime;
      const minutes = (endOfPeriod.getTime() - startTime.getTime()) / 60000; // Convert milliseconds to minutes

      if (!entries.has(hour)) {
        entries.set(hour, { focus: 0, break: 0 });
      }

      const entry = entries.get(hour)!;
      if (log.mode === 'focus') {
        entry.focus += minutes;
      } else {
        entry.break += minutes;
      }

      startTime = nextHour;
    }
  }

  entries.forEach((entry) => {
    entry.focus = Math.round(entry.focus);
    entry.break = Math.round(entry.break);
  });

  return entries;
};

export { formatTime, validatePassword, validateEmail, processLogs };
