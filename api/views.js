import { json, redis } from './_lib/redis.js';

const noStore = { 'Cache-Control': 'no-store' };

export async function GET() {
  const views = Number((await redis.get('views')) || 0);
  return json({ views }, 200, noStore);
}

export async function POST() {
  const views = await redis.incr('views');
  return json({ views }, 200, noStore);
}
