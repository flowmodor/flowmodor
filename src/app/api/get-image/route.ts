import sharp from 'sharp';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const imageBuffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const padding = 36;
    const borderSize = 1;
    const borderColor = '#23223C';

    const { width, height } = await sharp(imageBuffer).metadata();
    const newWidth = width! + padding * 2 + borderSize * 2;
    const newHeight = height! + padding * 2 + borderSize * 2;

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
          top: padding + borderSize,
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
