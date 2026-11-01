// Cloudflare Pages Function: /api/comments
//   GET    ?limit=3&cursor=..  public: newest comments, a page at a time
//   POST                       public: add a comment
//   PATCH  ?id=<key>           public: { like: 1 | -1 }
//   DELETE ?id=<key>           admin:  delete a comment
// Stored in the same MESSAGES KV namespace as contact messages, under "cmt:".
import { json, requireAdmin, clean, readJson, newKey, noStorage } from '../../server/lib.js'

const MAX_IMG = 400_000 // ~300 KB image; the browser shrinks uploads to 480px first

export async function onRequest({ request, env }) {
  if (!env.MESSAGES) return noStorage()
  const url = new URL(request.url)

  if (request.method === 'GET') {
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit')) || 3, 1), 100)
    const cursor = url.searchParams.get('cursor') || undefined
    const page = await env.MESSAGES.list({ prefix: 'cmt:', limit, cursor })
    const items = await Promise.all(
      page.keys.map(async (k) => ({ id: k.name, ...(await env.MESSAGES.get(k.name, 'json')) }))
    )
    return json({ comments: items.filter((c) => c.t), cursor: page.list_complete ? null : page.cursor })
  }

  if (request.method === 'POST') {
    const body = await readJson(request)
    if (!body) return json({ error: 'Invalid request.' }, 400)
    const name = clean(body.name, 40)
    const text = clean(body.text, 400)
    if (body.website) return json({ ok: true, comment: null }) // honeypot
    if (!name || !text) return json({ error: 'Please enter your name and a comment.' }, 400)
    let img = null
    if (body.img) {
      if (typeof body.img !== 'string' || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(body.img) || body.img.length > MAX_IMG) {
        return json({ error: 'That image could not be used. Try a smaller one.' }, 400)
      }
      img = body.img
    }
    const id = newKey('cmt')
    const comment = { name, text, img, likes: 0, t: Date.now() }
    await env.MESSAGES.put(id, JSON.stringify(comment))
    return json({ ok: true, comment: { id, ...comment } }, 201)
  }

  const id = url.searchParams.get('id') || ''
  if (!id.startsWith('cmt:')) return json({ error: 'Missing comment id.' }, 400)

  if (request.method === 'PATCH') {
    const body = await readJson(request)
    const delta = body && body.like === -1 ? -1 : 1
    const c = await env.MESSAGES.get(id, 'json')
    if (!c) return json({ error: 'Not found.' }, 404)
    const likes = Math.max(0, (c.likes || 0) + delta)
    await env.MESSAGES.put(id, JSON.stringify({ ...c, likes }))
    return json({ ok: true, likes })
  }

  if (request.method === 'DELETE') {
    const denied = await requireAdmin(request, env)
    if (denied) return denied
    await env.MESSAGES.delete(id)
    return json({ ok: true })
  }
  return json({ error: 'Method not allowed.' }, 405)
}
