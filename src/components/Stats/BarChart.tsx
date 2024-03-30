/* eslint-disable no-restricted-syntax */
import { Chip } from '@nextui-org/chip';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { ForwardedRef, forwardRef } from 'react';
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

          return `${hourStart}:${minuteStart} - ${hourEnd}:${minuteEnd}\n${
            datapoints[0].dataset.label ?? 'unspecified'
          }`;
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

function BarChart({ logs }: Props, ref: ForwardedRef<any>) {
  const hours = Array.from(Array(24).keys());

  const focusDatasets = logs
    .filter((log) => log.mode === 'focus')
    .map((log) => logToChartData(log));

  const breakDatasets = logs
    .filter((log) => log.mode === 'break')
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
    <>
      <Bar
        ref={ref}
        options={options}
        plugins={[setBackground]}
        data={{
          labels: hours,
          datasets: [
            ...focusDatasets.map((dataset) => ({
              label: dataset.label ?? 'unspecified',
              data: dataset.chartData,
              borderColor: '#D6B6FF',
              backgroundColor: '#D6B6FF',
              hoverBackgroundColor: '#D6B6FFC0',
              hoverBorderColor: '#D6B6FFC0',
              borderRadius: 3,
              borderSkipped: false,
            })),
            ...breakDatasets.map((dataset) => ({
              label: dataset.label ?? 'unspecified',
              data: dataset.chartData,
              borderColor: '#3F3E55',
              backgroundColor: '#3F3E55',
              hoverBackgroundColor: '#3F3E55C0',
              hoverBorderColor: '#3F3E55C0',
              borderRadius: 3,
              borderSkipped: false,
            })),
          ],
        }}
      />
      <div className="mt-2 flex gap-5">
        <Chip
          color="primary"
          variant="dot"
          classNames={{
            base: 'border border-secondary',
          }}
        >
          focus
        </Chip>
        <Chip
          color="secondary"
          variant="dot"
          classNames={{
            base: 'border border-secondary',
          }}
        >
          break
        </Chip>
      </div>
    </>
  );
}

export default forwardRef<any, Props>(BarChart);
