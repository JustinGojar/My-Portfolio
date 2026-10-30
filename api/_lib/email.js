// Sends an email through Resend (https://resend.com). Returns { ok } or { ok: false, error }.
export async function sendEmail({ to, subject, text, replyTo }) {
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY is not configured on the server.' };
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
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
