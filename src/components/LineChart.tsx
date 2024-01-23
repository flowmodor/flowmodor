/* eslint-disable jsx-a11y/control-has-associated-label */
import { Dispatch, SetStateAction } from 'react';
import { Spinner } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
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
import { Left, Right } from './Icons';

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
        color: '#00000000',
      },
    },
    y: {
      max: 60,
      grid: {
        color: '#3F3E55',
      },
    },
  },
  plugins: {
    tooltip: {
      boxPadding: 2,
      usePointStyle: true,
      callbacks: {
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
  date,
  setDate,
  data,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
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
    <Card className="w-full rounded-lg bg-[#23223C] p-5 lg:h-[60vh] lg:w-[50vw]">
      <CardHeader className="justify-center gap-5 font-semibold">
        <Button
          isIconOnly
          size="sm"
          className="bg-secondary fill-white hover:fill-primary"
          onPress={() => {
            const yesterday = new Date(date);
            yesterday.setDate(date.getDate() - 1);
            setDate(yesterday);
          }}
        >
          <Left />
        </Button>
        {date.toDateString()}
        <Button
          isIconOnly
          size="sm"
          className="bg-secondary fill-white hover:fill-primary"
          onPress={() => {
            const tomorrow = new Date(date);
            tomorrow.setDate(date.getDate() + 1);
            setDate(tomorrow);
          }}
        >
          <Right />
        </Button>
      </CardHeader>
      <CardBody className="flex items-center justify-center">
        {data ? (
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
        ) : (
          <Spinner color="primary" />
        )}
      </CardBody>
    </Card>
  );
}
