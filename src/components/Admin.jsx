import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Inbox, LogOut, Mail, RefreshCw, Trash2 } from 'lucide-react';

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

  const call = useCallback(
    (method, id) =>
      fetch(`/api/messages${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
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

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    setMessages((ms) => ms.filter((x) => x.id !== id));
    await call('DELETE', id);
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
              onClick={() => markRead(m)}
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
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{m.message}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
