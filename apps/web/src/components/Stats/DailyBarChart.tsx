/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useStartDate } from '@/hooks/useStats';
import { dailyLogToChartData } from '@/utils';

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
  interaction: {
    mode: 'dataset' as const,
  },
  scales: {
    x: {
      stacked: true,
      min: 0,
      max: 23,
      stepSize: 1,
      title: {
        display: true,
        text: 'Hours',
        color: '#FFFFFFA0',
        padding: { top: 10, bottom: 0, left: 0, right: 0 },
      },
      grid: {
        color: '#3F3E55',
      },
      ticks: {
        color: '#FFFFFFA0',
      },
    },
    y: {
      min: 0,
      max: 60,
      stepSize: 10,
      title: {
        display: true,
        text: 'Minutes',
        color: '#FFFFFFA0',
        padding: { top: 0, bottom: 10, left: 0, right: 0 },
      },
      grid: {
        color: '#3F3E55',
      },
      ticks: {
        color: '#FFFFFFA0',
      },
    },
  },
  plugins: {
    setBackground: {},
    tooltip: {
      position: 'nearest' as const,
      boxPadding: 2,
      usePointStyle: true,
      backgroundColor: '#131221',
      callbacks: {
        title: (xDatapoint: any) => {
          const datapoints = xDatapoint.filter(
            (point: any) => point.raw[0] + point.raw[1] > 0,
          );

          const hourStart = datapoints[0].label;
          const hourEnd = datapoints[datapoints.length - 1].label;

          const minuteStart = datapoints[0].raw[0].toString().padStart(2, '0');
          const minuteEnd = datapoints[datapoints.length - 1].raw[1]
            .toString()
            .padStart(2, '0');

          return `${hourStart}:${minuteStart} - ${hourEnd}:${minuteEnd}\n${datapoints[0].dataset.label}`;
        },
        label: () => '',
        labelColor(ctx: any) {
          return {
            borderColor: ctx.dataset.borderColor,
            backgroundColor: ctx.dataset.borderColor,
            borderWidth: 3,
          };
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

function DailyBarChart({ logs }: Props, ref: ForwardedRef<any>) {
  const hours = Array.from(Array(24).keys());
  const date = useStartDate();
  const focusDatasets = logs.map((log) => dailyLogToChartData(log, date));

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

  const datasets = focusDatasets.map((dataset) => ({
    label: dataset.label,
    data: dataset.chartData,
    borderColor: '#DBBFFF',
    backgroundColor: '#DBBFFF',
    hoverBackgroundColor: '#DBBFFFC0',
    hoverBorderColor: '#DBBFFFC0',
    borderRadius: 3,
    borderSkipped: false,
  }));

  return (
    <Bar
      ref={ref}
      options={options}
      plugins={[setBackground]}
      data={{
        labels: hours,
        datasets,
      }}
    />
  );
}

export default memo(forwardRef<any, Props>(DailyBarChart));
