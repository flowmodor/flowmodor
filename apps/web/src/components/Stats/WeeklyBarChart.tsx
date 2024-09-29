import { LogsWithTasks } from '@flowmodor/types';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { ForwardedRef, forwardRef, memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { weeklyLogsToChartData } from '@/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
);

const options = {
  responsive: true,
  scales: {
    x: {
      grid: {
        color: '#3F3E55',
      },
      ticks: {
        color: '#FFFFFFA0',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Hours',
        color: '#FFFFFFA0',
      },
      grid: {
        color: '#3F3E55',
      },
      ticks: {
        stepSize: 1,
        color: '#FFFFFFA0',
      },
    },
  },
  plugins: {
    setBackground: {},
    tooltip: {
      position: 'nearest' as 'nearest',
      boxPadding: 2,
      usePointStyle: true,
      backgroundColor: '#131221',
      callbacks: {
        labelColor(ctx: any) {
          return {
            borderColor: ctx.dataset.borderColor,
            backgroundColor: ctx.dataset.borderColor,
            borderWidth: 3,
          };
        },
        label: (ctx: any) => {
          const { raw: time } = ctx;
          const hours = Math.floor(time);
          const minutes = Math.floor((time - hours) * 60);

          return `${hours > 0 ? `${hours} hr ` : ''}${
            minutes > 0 ? `${minutes} min` : ''
          }`;
        },
      },
    },
    legend: {
      display: false,
    },
  },
};

interface Props {
  logs: LogsWithTasks[];
}

function WeeklyBarChart({ logs }: Props, ref: ForwardedRef<any>) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = weeklyLogsToChartData(logs);

  const setBackground = {
    id: 'setBackground',
    beforeDraw: (chart: any) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#23223C';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  return (
    <Bar
      ref={ref}
      options={options}
      plugins={[setBackground]}
      data={{
        labels: days,
        datasets: [
          {
            label: 'Focus',
            data: chartData,
            borderColor: '#DBBFFF',
            backgroundColor: '#DBBFFF',
            hoverBackgroundColor: '#DBBFFFC0',
            hoverBorderColor: '#DBBFFFC0',
            borderRadius: 3,
            borderSkipped: false,
          },
        ],
      }}
    />
  );
}

export default memo(forwardRef<any, Props>(WeeklyBarChart));
