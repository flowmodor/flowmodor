import { LogsWithTasks } from '@flowmodor/types';

const formatTime = (time: number) => {
  const t = Math.floor(time);
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

function dailyLogToChartData(log: LogsWithTasks, date: Date) {
  const chartData = Array.from({ length: 24 }, () => [0, 0]);
  const startTime = new Date(log.start_time);
  const endTime = new Date(log.end_time);

  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const effectiveStart = new Date(
    Math.max(startTime.getTime(), today.getTime()),
  );
  const effectiveEnd = new Date(
    Math.min(endTime.getTime(), today.getTime() + 24 * 60 * 60 * 1000 - 1),
  );

  if (effectiveEnd <= effectiveStart) {
    return {};
  }

  const startHour = effectiveStart.getHours();
  const endHour = effectiveEnd.getHours();
  const startMinute = effectiveStart.getMinutes();
  const endMinute = effectiveEnd.getMinutes();

  if (startHour === endHour) {
    chartData[startHour] = [startMinute, endMinute];
  } else {
    chartData[startHour] = [startMinute, 60];
    for (let hour = startHour + 1; hour < endHour; hour += 1) {
      chartData[hour] = [0, 60];
    }
    chartData[endHour] = [0, endMinute];
  }

  const taskName = log.task_name ?? log.tasks?.name;
  return {
    label: taskName ?? 'General Focus',
    chartData,
  };
}

function weeklyLogsToChartData(logs: LogsWithTasks[]) {
  const chartData = Array.from({ length: 7 }, () => 0);

  logs.forEach((log) => {
    const startTime = new Date(log.start_time);
    const endTime = new Date(log.end_time);

    chartData[startTime.getDay()] +=
      (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60;
  });

  return chartData;
}

const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeType });
};

export {
  formatTime,
  validatePassword,
  validateEmail,
  dailyLogToChartData,
  weeklyLogsToChartData,
  base64ToBlob,
};
