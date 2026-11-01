// Cloudflare Pages Function: /api/messages
//   POST              public: save a contact-form message
//   GET               admin:  list messages (newest first)
//   DELETE ?id=<key>  admin:  delete one message
//   PATCH  ?id=<key>  admin:  mark a message as read
//
// Needs two settings in the Cloudflare Pages project:
//   MESSAGES        KV namespace binding
//   ADMIN_PASSWORD  secret (encrypted variable)

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

const sha256 = async (s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))

async function isAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false
  const given = (request.headers.get('authorization') || '').replace(/^Bearer /, '')
  const [a, b] = await Promise.all([sha256(given), sha256(env.ADMIN_PASSWORD)])
  return crypto.subtle.timingSafeEqual(a, b)
}

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function onRequest({ request, env }) {
  if (!env.MESSAGES) return json({ error: 'Message storage is not set up yet.' }, 503)

  if (request.method === 'POST') {
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid request.' }, 400) }
    if (body.website) return json({ ok: true }) // honeypot: bots fill hidden fields
    const name = clean(body.name, 80)
    const email = clean(body.email, 120)
    const message = clean(body.message, 4000)
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Please fill in your name, a valid email and a message.' }, 400)
    }
    const t = Date.now()
    // newest-first ordering: KV lists keys alphabetically
    const id = `msg:${String(9e15 - t).padStart(16, '0')}:${crypto.randomUUID().slice(0, 8)}`
    await env.MESSAGES.put(id, JSON.stringify({ name, email, message, t, read: false }))
    return json({ ok: true }, 201)
  }

  if (!(await isAdmin(request, env))) return json({ error: 'Wrong password.' }, 401)

  if (request.method === 'GET') {
    const { keys } = await env.MESSAGES.list({ prefix: 'msg:', limit: 200 })
    const items = await Promise.all(
      keys.map(async (k) => ({ id: k.name, ...(await env.MESSAGES.get(k.name, 'json')) }))
    )
    return json({ messages: items.filter((m) => m.t) })
  }

  const id = new URL(request.url).searchParams.get('id') || ''
  if (!id.startsWith('msg:')) return json({ error: 'Missing message id.' }, 400)

  if (request.method === 'DELETE') {
    await env.MESSAGES.delete(id)
    return json({ ok: true })
  }
  if (request.method === 'PATCH') {
    const m = await env.MESSAGES.get(id, 'json')
    if (!m) return json({ error: 'Not found.' }, 404)
    await env.MESSAGES.put(id, JSON.stringify({ ...m, read: true }))
    return json({ ok: true })
  }
  return json({ error: 'Method not allowed.' }, 405)
}
