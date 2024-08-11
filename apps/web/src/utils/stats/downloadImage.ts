import { MutableRefObject } from 'react';
import { base64ToBlob } from '..';

export default async function downloadImage(
  chartRef: MutableRefObject<any>,
  totalFocusTime: number,
  date: Date,
) {
  if (!chartRef.current) {
    return false;
  }

  const base64Image = chartRef.current.toBase64Image();
  const result = await fetch('/api/get-image', {
    method: 'POST',
    body: JSON.stringify({
      image: base64Image,
      totalFocusTime: Math.round(totalFocusTime),
      date: date.toDateString(),
    }),
  });

  const { image } = await result.json();

  if (result.ok && image) {
    const modifiedImageBlob = base64ToBlob(image, 'image/png');
    const downloadUrl = URL.createObjectURL(modifiedImageBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `stats_${date.toISOString()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
  return false;
}
