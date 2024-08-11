import sharp from 'sharp';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const { image, totalFocusTime, date } = await req.json();

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

    const { width, height } = await sharp(imageBuffer).metadata();
    const newWidth = width! + padding * 2 + borderSize * 2;
    const newHeight = height! + topPadding + padding + borderSize * 2;

    const textSvg = `<svg width="${newWidth}" height="${topPadding}">
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="#FFFFFF" font-weight="bold" font-family="Inter">
        ${hours > 0 ? `${hours} hr` : ''} ${leftMinutes} min
      </text>
      <text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="#FFFFFFA0" font-weight="medium" font-family="Inter">
        ${date}
      </text>
    </svg>`;
    const textBuffer = Buffer.from(textSvg);

    const modifiedImage = await sharp({
      create: {
        width: newWidth,
        height: newHeight,
        channels: 4,
        background: borderColor,
      },
    })
      .composite([
        {
          input: textBuffer, // Add the SVG with text as an overlay
          top: 0,
          left: 0,
        },
        {
          input: imageBuffer,
          top: topPadding + borderSize,
          left: padding + borderSize,
        },
      ])
      .toFormat('png')
      .toBuffer();

    const base64Image = modifiedImage.toString('base64');

    return Response.json({ image: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    console.error('Error processing image', error);
    return Response.json({ error: 'Error processing image' });
  }
}
