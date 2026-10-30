import { sendEmail } from './_lib/email.js';
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

// Emails a reply to the person who sent the message and stores it on the message.
export async function POST(req) {
  const denied = guard(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400, noStore);
  const raw = await redis.hget('messages', id);
  if (!raw) return json({ error: 'Not found' }, 404, noStore);

  let reply;
  try {
    reply = (await req.json())?.reply;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, noStore);
  }
  if (typeof reply !== 'string' || !reply.trim()) return json({ error: 'Reply cannot be empty.' }, 422, noStore);
  if (reply.length > 5000) return json({ error: 'Reply is too long (max 5000 characters).' }, 422, noStore);

  const msg = parse(raw);
  const quoted = msg.message.split('\n').map((line) => `> ${line}`).join('\n');
  const sent = await sendEmail({
    to: msg.email,
    replyTo: process.env.CONTACT_TO_EMAIL,
    subject: `Re: ${msg.subject || 'Your message'}`,
    text: `Hi ${msg.name},\n\n${reply.trim()}\n\n---\nOn ${new Date(msg.createdAt).toUTCString()}, you wrote:\n${quoted}`,
  });
  if (!sent.ok) return json({ error: sent.error }, 502, noStore);

  const updated = {
    ...msg,
    read: true,
    replies: [...(msg.replies || []), { text: reply.trim(), sentAt: new Date().toISOString() }],
  };
  await redis.hset('messages', { [id]: JSON.stringify(updated) });
  return json({ ok: true, message: updated }, 200, noStore);
}

export async function DELETE(req) {
  const denied = guard(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400, noStore);
  await redis.hdel('messages', id);
  return json({ ok: true }, 200, noStore);
}
