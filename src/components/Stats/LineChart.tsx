import { Chip } from '@nextui-org/chip';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { ForwardedRef, forwardRef } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const options = {
  responsive: true,
  scales: {
    x: {
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

function LineChart({ data }: Props, ref: ForwardedRef<any>) {
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
      <Line
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
              hoverBackgroundColor: '#D6B6FF',
              hoverBorderColor: '#D6B6FF',
              backgroundColor: '#D6B6FF10',
              fill: true,
              clip: false,
              tension: 0.5,
              pointHoverRadius: 7,
              pointHitRadius: 30,
              pointRadius: 1,
            },
            {
              label: 'Break Time',
              data: breakTimes,
              borderColor: '#3F3E55',
              hoverBackgroundColor: '#3F3E55',
              hoverBorderColor: '#3F3E55',
              backgroundColor: '#3F3E5510',
              fill: true,
              clip: false,
              tension: 0.5,
              pointHoverRadius: 7,
              pointHitRadius: 30,
              pointRadius: 1,
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

export default forwardRef<any, Props>(LineChart);
