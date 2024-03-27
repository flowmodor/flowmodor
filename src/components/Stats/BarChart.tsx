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
      stacked: true,
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
      boxPadding: 2,
      usePointStyle: true,
      backgroundColor: '#131221',
      callbacks: {
        title: (xDatapoint: any) =>
          `${xDatapoint[0].label}:00 - ${
            parseInt(xDatapoint[0].label, 10) + 1
          }:00`,
        label: (yDatapoint: any) => `${yDatapoint.raw} mins`,
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
  data: Map<number, any> | undefined;
}

function BarChart({ data }: Props, ref: ForwardedRef<any>) {
  const hours = Array.from(Array(24).keys());
  const focusTimes = data
    ? hours.map((hour) => data.get(hour)?.focus ?? 0)
    : null;
  const breakTimes = data
    ? hours.map((hour) => data.get(hour)?.break ?? 0)
    : null;

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
            {
              label: 'Focus Time',
              data: focusTimes,
              borderColor: '#D6B6FF',
              backgroundColor: '#D6B6FF',
              hoverBackgroundColor: '#D6B6FFC0',
              hoverBorderColor: '#D6B6FFC0',
              borderRadius: 3,
              clip: false,
            },
            {
              label: 'Break Time',
              data: breakTimes,
              borderColor: '#3F3E55',
              backgroundColor: '#3F3E55',
              hoverBackgroundColor: '#3F3E55C0',
              hoverBorderColor: '#3F3E55C0',
              borderRadius: 3,
              clip: false,
            },
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
