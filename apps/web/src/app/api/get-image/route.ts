import { createCanvas, loadImage, registerFont } from 'canvas';

registerFont('./public/fonts/Inter-Regular.ttf', {
  family: 'Inter',
});

registerFont('./public/fonts/Inter-Bold.ttf', {
  family: 'Inter',
  weight: 'bold',
});

export async function POST(req: Request) {
  try {
    const { image, totalFocusTime, dateText } = await req.json();

    const hours = Math.floor(totalFocusTime / 60);
    const leftMinutes = totalFocusTime % 60;

    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const padding = 36;
    const topPadding = 80;
    const borderSize = 1;
    const borderColor = '#23223C';
    const originalImage = await loadImage(imageBuffer);
    const { width, height } = originalImage;
    const newWidth = width + padding * 2 + borderSize * 2;
    const newHeight = height + topPadding + padding + borderSize * 2;

    const canvas = createCanvas(newWidth, newHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, newHeight);

    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, topPadding);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const centerY = topPadding / 2 + 12;

    ctx.font = 'bold 32px Inter';
    const hoursWidth = ctx.measureText(hours.toString()).width;
    ctx.font = '16px Inter';
    const hrWidth = ctx.measureText('hr').width;
    ctx.font = 'bold 32px Inter';
    const minutesWidth = ctx.measureText(leftMinutes.toString()).width;
    ctx.font = '16px Inter';
    const minWidth = ctx.measureText('min').width;

    const numberUnitSpacing = 4;
    const hourMinuteSpacing = 10;

    const totalWidth =
      hours > 0
        ? hoursWidth +
          numberUnitSpacing +
          hrWidth +
          hourMinuteSpacing +
          minutesWidth +
          numberUnitSpacing +
          minWidth
        : minutesWidth + numberUnitSpacing + minWidth;

    let currentX = (newWidth - totalWidth) / 2;

    if (hours > 0) {
      ctx.font = 'bold 32px Inter';
      ctx.fillText(hours.toString(), currentX, centerY);
      currentX += hoursWidth + numberUnitSpacing;

      ctx.font = '16px Inter';
      ctx.fillText('hr', currentX, centerY);
      currentX += hrWidth + hourMinuteSpacing;
    }

    ctx.font = 'bold 32px Inter';
    ctx.fillText(leftMinutes.toString(), currentX, centerY);
    currentX += minutesWidth + numberUnitSpacing;

    ctx.font = '16px Inter';
    ctx.fillText('min', currentX, centerY);

    ctx.fillStyle = '#FFFFFFA0';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(dateText, newWidth / 2, topPadding - 6);

    ctx.drawImage(
      originalImage,
      padding + borderSize,
      topPadding + borderSize,
      width,
      height,
    );

    const base64Image = canvas.toBuffer('image/png').toString('base64');
    return Response.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error('Error processing image', error);
    return Response.json({ error: 'Error processing image' });
  }
}
