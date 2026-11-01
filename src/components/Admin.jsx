import { useCallback, useEffect, useState } from 'react'
import { Lock, LogOut, RefreshCw, Trash2, Reply, Inbox, ArrowLeft } from 'lucide-react'

const KEY = 'portfolio-admin-pass'
const getPass = () => {
  try { return sessionStorage.getItem(KEY) || '' } catch { return '' }
}
const setPass = (v) => {
  try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY) } catch { /* blocked */ }
}

async function api(pass, method = 'GET', id) {
  const res = await fetch(`/api/messages${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
    method,
    headers: { authorization: `Bearer ${pass}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

const when = (t) =>
  new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function Admin() {
  const [pass, setPassState] = useState(getPass)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const logout = () => {
    setPass('')
    setPassState('')
    setMessages(null)
  }

  const load = useCallback(async (p) => {
    setLoading(true)
    setError('')
    try {
      const data = await api(p)
      setMessages(data.messages)
      setPass(p)
      setPassState(p)
    } catch (e) {
      setError(e.message)
      if (e.status === 401) logout()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.title = 'Admin · Messages'
    if (pass) load(pass)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const open = async (m) => {
    if (m.read) return
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read: true } : x)))
    api(pass, 'PATCH', m.id).catch(() => {})
  }
  const remove = async (m) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return
    try {
      await api(pass, 'DELETE', m.id)
      setMessages((list) => list.filter((x) => x.id !== m.id))
    } catch (e) {
      setError(e.message)
    }
  }

  if (!pass || messages === null) {
    return (
      <main className="admin">
        <form
          className="panel-card admin-login"
          onSubmit={(e) => {
            e.preventDefault()
            load(input)
          }}
        >
          <div className="admin-lock"><Lock size={20} /></div>
          <h3>Admin</h3>
          <p className="sub">Enter the admin password to read your messages.</p>
          <div className="field plain">
            <input type="password" required autoFocus placeholder="Password" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button className="submit" type="submit" disabled={loading}>{loading ? 'Checking…' : 'Log in'}</button>
          <a className="admin-back" href="#home"><ArrowLeft size={14} /> Back to site</a>
        </form>
      </main>
    )
  }

  const unread = messages.filter((m) => !m.read).length
  return (
    <main className="admin">
      <div className="container">
        <header className="admin-head">
          <div>
            <h1 className="sec-title">Messages</h1>
            <p className="sub">{messages.length} total · {unread} unread</p>
          </div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={() => load(pass)} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
            </button>
            <button className="btn btn-ghost" onClick={logout}><LogOut size={15} /> Log out</button>
          </div>
        </header>

        {error && <p className="admin-error">{error}</p>}

        {messages.length === 0 ? (
          <div className="panel-card admin-empty"><Inbox size={28} /><p>No messages yet.</p></div>
        ) : (
          <div className="admin-list">
            {messages.map((m) => (
              <details key={m.id} className={`panel-card admin-msg ${m.read ? '' : 'unread'}`} onToggle={(e) => e.currentTarget.open && open(m)}>
                <summary>
                  <span className="dot" aria-label={m.read ? 'Read' : 'Unread'} />
                  <b>{m.name}</b>
                  <span className="email">{m.email}</span>
                  <span className="snippet">{m.message}</span>
                  <time>{when(m.t)}</time>
                </summary>
                <p className="admin-body">{m.message}</p>
                <div className="btn-row">
                  <a className="btn btn-primary" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message on my portfolio')}`}>
                    <Reply size={15} /> Reply by email
                  </a>
                  <button className="btn btn-ghost" onClick={() => remove(m)}><Trash2 size={15} /> Delete</button>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
