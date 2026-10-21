import { json, redis } from './_lib/redis.js';

const noStore = { 'Cache-Control': 'no-store' };

// Returns an error Response, or null when the request carries the right token.
function guard(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return json({ error: 'ADMIN_TOKEN is not configured on the server.' }, 503, noStore);
  if (req.headers.get('authorization') !== `Bearer ${token}`) return json({ error: 'Unauthorized' }, 401, noStore);
  return null;
}

// Upstash parses stored JSON automatically, so values may already be objects.
const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

export async function GET(req) {
  const denied = guard(req);
  if (denied) return denied;
  const all = (await redis.hgetall('messages')) || {};
  const messages = Object.values(all).map(parse).filter(Boolean);
  messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return json({ messages }, 200, noStore);
}

export async function PATCH(req) {
  const denied = guard(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400, noStore);
  const raw = await redis.hget('messages', id);
  if (!raw) return json({ error: 'Not found' }, 404, noStore);
  await redis.hset('messages', { [id]: JSON.stringify({ ...parse(raw), read: true }) });
  return json({ ok: true }, 200, noStore);
}

export async function DELETE(req) {
  const denied = guard(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400, noStore);
  await redis.hdel('messages', id);
  return json({ ok: true }, 200, noStore);
}
