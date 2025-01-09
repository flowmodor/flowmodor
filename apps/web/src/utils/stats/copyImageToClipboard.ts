import { RefObject } from 'react';
import { base64ToBlob } from '..';

const formatImageUrl = (base64Data: string) => {
  const cleanData = base64Data.replace(/^data:image\/\w+;base64,/, '');
  return `data:image/png;base64,${cleanData}`;
};

export default async function copyImageToClipboard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartRef: RefObject<any>,
  totalFocusTime: number,
  dateText: string,
): Promise<string | undefined> {
  if (!chartRef.current) {
    return undefined;
  }

  try {
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

    if (!result.ok || !image) {
      return undefined;
    }

    const imageUrl = formatImageUrl(image);
    const modifiedImageBlob = base64ToBlob(image, 'image/png');

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [modifiedImageBlob.type]: modifiedImageBlob,
        }),
      ]);
      return imageUrl;
    } catch (clipboardErr) {
      console.error('Failed to copy image to clipboard:', clipboardErr);
      return imageUrl;
    }
  } catch (err) {
    console.error('Failed to process image:', err);
    return undefined;
  }
}
