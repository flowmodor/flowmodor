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
import { logToChartData } from '@/utils';
import { LogsWithTasks } from '@/utils/stats/calculateTaskTime';

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
    mode: 'dataset' as 'dataset',
  },
  scales: {
    x: {
      stacked: true,
      min: 0,
      max: 23,
      stepSize: 1,
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
      position: 'nearest' as 'nearest',
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

  const focusDatasets = logs
    .filter((log) => log.mode === 'focus')
    .map((log) => logToChartData(log));

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
        labels: hours,
        datasets: [
          ...focusDatasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.chartData,
            borderColor: '#DBBFFF',
            backgroundColor: '#DBBFFF',
            hoverBackgroundColor: '#DBBFFFC0',
            hoverBorderColor: '#DBBFFFC0',
            borderRadius: 3,
            borderSkipped: false,
          })),
        ],
      }}
    />
  );
}

export default memo(forwardRef<any, Props>(DailyBarChart));
