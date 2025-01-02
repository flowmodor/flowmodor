import { RefObject } from 'react';
import { base64ToBlob } from '..';

export default async function copyImageToClipboard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartRef: RefObject<any>,
  totalFocusTime: number,
  dateText: string,
): Promise<boolean> {
  if (!chartRef.current) {
    return false;
  }

  const base64Image = chartRef.current.toBase64Image();
  const result = await fetch('/api/get-image', {
    method: 'POST',
    body: JSON.stringify({
      image: base64Image,
      totalFocusTime: Math.round(totalFocusTime),
      dateText,
    }),
  });

  const { image } = await result.json();
  if (result.ok && image) {
    try {
      const modifiedImageBlob = base64ToBlob(image, 'image/png');
      await navigator.clipboard.write([
        new ClipboardItem({
          [modifiedImageBlob.type]: modifiedImageBlob,
        }),
      ]);
      return true;
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      return false;
    }
  }
  return false;
}
