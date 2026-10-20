import { getStore } from '@netlify/blobs';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export default async (req) => {
  const store = getStore('stats');
  let views = Number((await store.get('views')) || 0);

  if (req.method === 'POST') {
    views += 1;
    await store.set('views', String(views));
  } else if (req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  return json({ views });
};

export const config = { path: '/api/views' };
