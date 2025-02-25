import NumberFlow from '@number-flow/react';

interface TimeDisplayProps {
  hours?: number;
  minutes: number;
  seconds: number;
}

export default function TimeDisplay({
  hours,
  minutes,
  seconds,
}: TimeDisplayProps) {
  return (
    <div
      id="time"
      className={`flex items-center gap-1 ${typeof hours === 'number' ? 'text-[2.5rem]' : ''}`}
    >
      {typeof hours === 'number' && (
        <>
          <NumberFlow
            value={hours}
            className="inline-block w-[2ch] text-right"
            format={{ minimumIntegerDigits: 2, useGrouping: false }}
          />
          <span className="inline-block w-[1rem] text-center">:</span>
        </>
      )}
      <NumberFlow
        value={minutes}
        className={`inline-block w-[2ch] ${typeof hours === 'number' ? 'text-center' : 'text-right'}`}
        format={{ minimumIntegerDigits: 2, useGrouping: false }}
      />
      <span className="inline-block w-[1rem] text-center">:</span>
      <NumberFlow
        value={seconds}
        className="inline-block w-[2ch] text-left"
        format={{ minimumIntegerDigits: 2, useGrouping: false }}
      />
    </div>
  );
}
