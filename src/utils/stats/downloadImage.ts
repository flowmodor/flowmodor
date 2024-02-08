import { elementToSVG } from 'dom-to-svg';
import { MutableRefObject, RefObject } from 'react';
import { toast } from 'react-toastify';
import { base64ToBlob } from '..';

export default async function downloadImage(
  chartRef: MutableRefObject<any>,
  summaryRef: RefObject<HTMLDivElement>,
  date: Date,
) {
  if (!chartRef.current || !summaryRef.current) {
    return;
  }

  const svgDocument = elementToSVG(summaryRef.current);
  const svgString = new XMLSerializer().serializeToString(svgDocument);

  const base64Image = chartRef.current.toBase64Image();
  const result = await fetch('/api/get-image', {
    method: 'POST',
    body: JSON.stringify({
      image: base64Image,
      summary: svgString,
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
  } else {
    toast('Error downloading image. Please try again.');
  }
}
