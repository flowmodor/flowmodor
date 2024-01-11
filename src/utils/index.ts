const formatTime = (t: number) => {
  const minutes = Math.floor(t / 60);
  const seconds = t % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

// eslint-disable-next-line import/prefer-default-export
export { formatTime };
