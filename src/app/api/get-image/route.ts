import sharp from 'sharp';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const { image, summary } = await req.json();

    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const summaryBuffer = Buffer.from(summary);

    const padding = 36;
    const topPadding = 80;
    const borderSize = 1;
    const borderColor = '#23223C';

    const { width, height } = await sharp(imageBuffer).metadata();
    const summaryMetadata = await sharp(summaryBuffer).metadata();
    const newWidth = width! + padding * 2 + borderSize * 2;
    const newHeight = height! + topPadding + padding + borderSize * 2;

    const summaryLeftPosition = Math.max(
      0,
      (newWidth - summaryMetadata.width!) / 2,
    );

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
          input: imageBuffer,
          top: topPadding + borderSize,
          left: padding + borderSize,
        },
        {
          input: summaryBuffer,
          top: padding / 2,
          left: summaryLeftPosition,
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
