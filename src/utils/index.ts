import { LogsWithTasks } from '@/utils/stats/calculateTaskTime';

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

/* eslint-disable no-restricted-syntax */
function logToChartData(log: LogsWithTasks) {
  const chartData = Array.from({ length: 24 }, () => [0, 0]);

  const startTime = new Date(log.start_time);
  const endTime = new Date(log.end_time);

  if (startTime.getHours() === endTime.getHours()) {
    chartData[startTime.getHours()] = [
      startTime.getMinutes(),
      endTime.getMinutes(),
    ];
  } else {
    chartData[startTime.getHours()] = [startTime.getMinutes(), 60];
    chartData[endTime.getHours()] = [0, endTime.getMinutes()];
  }

  const taskName = log.task_name ?? log.tasks?.name;

  return {
    label: taskName ?? 'General Focus',
    chartData,
  };
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
  logToChartData,
  base64ToBlob,
};
