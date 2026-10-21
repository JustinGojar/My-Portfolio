import { json, redis } from './_lib/redis.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE_LIMIT = 5; // messages per IP per hour

function validate({ name, email, subject, message }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!email || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email.';
  if (subject && subject.length > 120) errors.subject = 'Subject is too long.';
  if (!message || message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  if (message && message.length > 5000) errors.message = 'Message is too long (max 5000 characters).';
  return errors;
}

async function sendEmail(entry) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [CONTACT_TO_EMAIL],
      reply_to: entry.email,
      subject: `Portfolio: ${entry.subject || 'New message'} — ${entry.name}`,
      text: `From: ${entry.name} <${entry.email}>\n\n${entry.message}`,
    }),
  });
  if (!res.ok) console.error('Resend error', res.status, await res.text());
}

export async function POST(req) {
  let data;
  try {
    data = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Honeypot field: real users never fill it in, bots usually do.
  if (data?.company) return json({ ok: true });

  data = Object.fromEntries(
    ['name', 'email', 'subject', 'message'].map((k) => [k, typeof data?.[k] === 'string' ? data[k] : '']),
  );

  const errors = validate(data);
  if (Object.keys(errors).length) return json({ error: 'Validation failed', errors }, 422);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const key = `rate:${ip}:${new Date().toISOString().slice(0, 13)}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 3600);
  if (count > RATE_LIMIT) return json({ error: 'Too many messages. Please try again later.' }, 429);

  const entry = {
    id: `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    subject: (data.subject || '').trim(),
    message: data.message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  await redis.hset('messages', { [entry.id]: JSON.stringify(entry) });

  try {
    await sendEmail(entry);
  } catch (err) {
    console.error('Email notification failed', err);
  }

  return json({ ok: true, id: entry.id }, 201);
}
