import { Chip } from '@nextui-org/chip';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
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
      grid: {
        color: '#3F3E55',
      },
      ticks: {
        color: '#FFFFFFA0',
      },
    },
    y: {
      max: 60,
      grid: {
        color: '#3F3E55',
      },
      ticks: {
        color: '#FFFFFFA0',
      },
    },
  },
  plugins: {
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

export default function LineChart({
  data,
}: {
  data: Map<number, any> | undefined;
}) {
  const hours = Array.from(Array(24).keys());
  const focusTimes = data
    ? hours.map((hour) => data.get(hour)?.focus ?? 0)
    : null;
  const breakTimes = data
    ? hours.map((hour) => data.get(hour)?.break ?? 0)
    : null;

  return (
    <>
      <Line
        options={options}
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
