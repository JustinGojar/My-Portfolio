import { getStore } from '@netlify/blobs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function authorized(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return req.headers.get('authorization') === `Bearer ${token}`;
}

export default async (req) => {
  if (!process.env.ADMIN_TOKEN) {
    return json({ error: 'ADMIN_TOKEN is not configured on the server.' }, 503);
  }
  if (!authorized(req)) return json({ error: 'Unauthorized' }, 401);

  const store = getStore('messages');
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const { blobs } = await store.list();
    const messages = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
    messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return json({ messages: messages.filter(Boolean) });
  }

  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Missing id' }, 400);

  if (req.method === 'PATCH') {
    const msg = await store.get(id, { type: 'json' });
    if (!msg) return json({ error: 'Not found' }, 404);
    await store.setJSON(id, { ...msg, read: true });
    return json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await store.delete(id);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = { path: '/api/messages' };
