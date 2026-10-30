import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Inbox, LogOut, Mail, RefreshCw, Reply, Send, Trash2, X } from 'lucide-react';

// Private inbox for messages sent through the contact form.
// Visit /admin and enter the ADMIN_TOKEN you set in Vercel.
export default function Admin() {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('admin-token') || '';
    } catch {
      return '';
    }
  });
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [openId, setOpenId] = useState(null);
  const open = messages.find((m) => m.id === openId);

  const call = useCallback(
    (method, id, body) =>
      fetch(`/api/messages${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, ...(body && { 'Content-Type': 'application/json' }) },
        ...(body && { body: JSON.stringify(body) }),
      }),
    [token],
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await call('GET');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setMessages(data.messages);
    } catch (e) {
      setError(e.message);
      if (e.message === 'Unauthorized') logout();
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, token]);

  useEffect(() => {
    load();
  }, [load]);

  const login = (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem('admin-token', input);
    } catch {
      /* storage unavailable */
    }
    setToken(input);
  };

  function logout() {
    try {
      sessionStorage.removeItem('admin-token');
    } catch {
      /* storage unavailable */
    }
    setToken('');
    setMessages([]);
  }

  const markRead = async (m) => {
    if (m.read) return;
    setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    await call('PATCH', m.id);
  };

  const openMessage = (m) => {
    setOpenId(m.id);
    markRead(m);
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    setOpenId((cur) => (cur === id ? null : cur));
    setMessages((ms) => ms.filter((x) => x.id !== id));
    await call('DELETE', id);
  };

  // Emails the reply to the sender; throws with the server's error message on failure.
  const sendReply = async (m, reply) => {
    const res = await call('POST', m.id, { reply });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to send reply');
    setMessages((ms) => ms.map((x) => (x.id === m.id ? data.message : x)));
  };

  if (!token) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-sm p-8"
        >
          <Inbox className="mb-4 text-accent" />
          <h1 className="text-2xl font-bold">Admin inbox</h1>
          <p className="mt-1 text-sm text-muted">Enter your ADMIN_TOKEN to view messages.</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Admin token"
            className="input mt-6"
            autoFocus
          />
          {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
          <button className="btn-primary mt-4 w-full">Unlock</button>
          <a href="/" className="mt-4 flex items-center justify-center gap-1 text-sm text-muted hover:text-accent">
            <ArrowLeft size={14} /> Back to site
          </a>
        </motion.form>
      </div>
    );
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="container-x min-h-screen py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-sm text-muted">
            {messages.length} messages · {unread} unread
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost !px-4 !py-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={logout} className="btn-ghost !px-4 !py-2">
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      {error && <p className="mb-4 text-sm text-rose-500">{error}</p>}
      {!loading && messages.length === 0 && <p className="text-muted">No messages yet.</p>}

      <ul className="space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              onClick={() => openMessage(m)}
              className={`glass cursor-pointer p-6 ${m.read ? '' : 'border-accent/40'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    {!m.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                    {m.name}
                    <a href={`mailto:${m.email}`} className="text-sm font-normal text-accent" onClick={(e) => e.stopPropagation()}>
                      <Mail size={14} className="mr-1 inline" />
                      {m.email}
                    </a>
                  </p>
                  {m.subject && <p className="mt-1 text-sm">{m.subject}</p>}
                  {m.replies?.length > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                      <Reply size={12} /> Replied{m.replies.length > 1 ? ` ×${m.replies.length}` : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <time className="font-mono text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</time>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(m.id);
                    }}
                    className="text-muted hover:text-rose-500"
                    aria-label="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{m.message}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {open && (
          <MessageModal
            key={open.id}
            message={open}
            onClose={() => setOpenId(null)}
            onDelete={() => remove(open.id)}
            onReply={(reply) => sendReply(open, reply)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageModal({ message: m, onClose, onDelete, onReply }) {
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setStatus('sending');
    setError('');
    try {
      await onReply(reply);
      setReply('');
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const subject = `Re: ${m.subject || 'Your message'}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(reply)}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-title"
        className="glass flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden !bg-card/95"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line/10 p-6">
          <div className="min-w-0">
            <h2 id="message-title" className="text-xl font-bold">
              {m.subject || 'No subject'}
            </h2>
            <p className="mt-1 text-sm">
              {m.name}{' '}
              <a href={`mailto:${m.email}`} className="break-all text-accent">
                &lt;{m.email}&gt;
              </a>
            </p>
            <time className="font-mono text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</time>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button onClick={onDelete} className="text-muted hover:text-rose-500" aria-label="Delete message">
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="text-muted hover:text-accent" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
          {m.replies?.map((r) => (
            <div key={r.sentAt} className="ml-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="mb-1 flex items-center gap-1 text-xs text-accent">
                <Reply size={12} /> You replied · {new Date(r.sentAt).toLocaleString()}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{r.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="border-t border-line/10 p-6">
          <textarea
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
              if (status !== 'sending') setStatus('idle');
            }}
            placeholder={`Reply to ${m.name}…`}
            rows={4}
            maxLength={5000}
            className="input resize-y"
          />
          {status === 'sent' && (
            <p className="mt-3 flex items-center gap-1 text-sm text-emerald-500">
              <CheckCircle2 size={14} /> Reply sent to {m.email}
            </p>
          )}
          {status === 'error' && <p className="mt-3 text-sm text-rose-500">{error}</p>}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <a href={gmailUrl} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
              <Mail size={14} /> Open in Gmail
            </a>
            <button disabled={!reply.trim() || status === 'sending'} className="btn-primary !px-4 !py-2 disabled:opacity-50">
              <Send size={14} /> {status === 'sending' ? 'Sending…' : 'Send reply'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
