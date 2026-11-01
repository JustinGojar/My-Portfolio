// Cloudflare Pages Function: /api/messages
//   POST              public: save a contact-form message
//   GET               admin:  list messages (newest first)
//   DELETE ?id=<key>  admin:  delete one message
//   PATCH  ?id=<key>  admin:  mark a message as read
//
// Needs two settings in the Cloudflare Pages project:
//   MESSAGES        KV namespace binding
//   ADMIN_PASSWORD  secret (encrypted variable)
import { json, requireAdmin, clean, readJson, newKey, noStorage } from '../../server/lib.js'

export async function onRequest({ request, env }) {
  if (!env.MESSAGES) return noStorage()

  if (request.method === 'POST') {
    const body = await readJson(request)
    if (!body) return json({ error: 'Invalid request.' }, 400)
    if (body.website) return json({ ok: true }) // honeypot: bots fill hidden fields
    const name = clean(body.name, 80)
    const email = clean(body.email, 120)
    const message = clean(body.message, 4000)
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Please fill in your name, a valid email and a message.' }, 400)
    }
    await env.MESSAGES.put(newKey('msg'), JSON.stringify({ name, email, message, t: Date.now(), read: false }))
    return json({ ok: true }, 201)
  }

  const denied = await requireAdmin(request, env)
  if (denied) return denied

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
