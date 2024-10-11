export default function TimeFormatter({ minutes }: { minutes: number }) {
  const hours = Math.floor(minutes / 60);
  const leftMinutes = Math.floor(minutes % 60);
  const seconds = Math.floor((minutes % 1) * 60);

  if (minutes < 1) {
    return (
      <div className="flex items-end gap-1">
        <div className="text-3xl font-semibold">{seconds}</div>
        sec
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {hours > 0 && (
        <div className="flex items-end gap-1">
          <div className="text-3xl font-semibold">{hours}</div>
          hr
        </div>
      )}
      {leftMinutes > 0 && (
        <div className="flex items-end gap-1">
          <div className="text-3xl font-semibold">{leftMinutes}</div>
          min
        </div>
      )}
    </div>
  );
}
