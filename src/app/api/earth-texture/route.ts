import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const imagePath = join(process.cwd(), 'public', 'images', 'earth.png');
    const imageBuffer = await readFile(imagePath);
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    // Fallback to a public-domain NASA Blue Marble texture if local art is unavailable.
    const SOURCE_URL =
      'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Marble_2002.png?width=2048';
    
    try {
      const response = await fetch(SOURCE_URL, { cache: 'force-cache' });
      if (!response.ok) {
        return new Response('Unable to load Earth texture.', { status: 502 });
      }
      return new Response(await response.arrayBuffer(), {
        headers: {
          'Content-Type': response.headers.get('content-type') ?? 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch {
      return new Response('Unable to load Earth texture.', { status: 502 });
    }
  }
}
