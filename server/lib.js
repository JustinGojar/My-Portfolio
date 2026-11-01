// Helpers shared by the Pages Functions in functions/api/.
// (Kept outside functions/ so Cloudflare doesn't turn this file into a route.)

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

const sha256 = async (s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))

// Returns an error Response, or null when the request carries the admin password.
export async function requireAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return json({ error: 'ADMIN_PASSWORD is not set in Cloudflare (or the site was not redeployed after adding it).' }, 503)
  }
  // trim both sides: a stray space or newline from copy-paste shouldn't lock you out
  const given = (request.headers.get('authorization') || '').replace(/^Bearer /, '').trim()
  const [a, b] = await Promise.all([sha256(given), sha256(env.ADMIN_PASSWORD.trim())])
  return crypto.subtle.timingSafeEqual(a, b) ? null : json({ error: 'Wrong password.' }, 401)
}

export const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export const readJson = async (request) => {
  try { return await request.json() } catch { return null }
}

// KV lists keys alphabetically, so an inverted timestamp gives newest-first order.
export const newKey = (prefix) =>
  `${prefix}:${String(9e15 - Date.now()).padStart(16, '0')}:${crypto.randomUUID().slice(0, 8)}`

export const noStorage = () => json({ error: 'Message storage is not set up yet.' }, 503)
