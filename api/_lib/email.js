const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>';
const FROM_RE = /^(?:[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>|[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)$/;

// CONTACT_FROM_EMAIL must be "email@example.com" or "Name <email@example.com>".
// Strip quotes/whitespace pasted into the dashboard; fall back to Resend's test sender if still invalid.
function fromAddress() {
  const raw = (process.env.CONTACT_FROM_EMAIL || '').trim().replace(/^["']|["']$/g, '').trim();
  if (!raw) return DEFAULT_FROM;
  if (FROM_RE.test(raw)) return raw;
  console.error(`Ignoring invalid CONTACT_FROM_EMAIL: ${JSON.stringify(raw)}`);
  return DEFAULT_FROM;
}

// Sends an email through Resend (https://resend.com). Returns { ok } or { ok: false, error }.
export async function sendEmail({ to, subject, text, replyTo }) {
  const { RESEND_API_KEY } = process.env;
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY is not configured on the server.' };
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress(),
        to: [to],
        ...(replyTo && { reply_to: replyTo }),
        subject,
        text,
      }),
    });
  } catch (err) {
    return { ok: false, error: `Could not reach Resend: ${err.message}` };
  }
  if (res.ok) return { ok: true };
  const body = await res.json().catch(() => ({}));
  return { ok: false, error: body.message || `Resend error ${res.status}` };
}
