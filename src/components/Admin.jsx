import { useCallback, useEffect, useState } from 'react'
import { profile } from '../data.js'
import { Lock, LogOut, RefreshCw, Trash2, Mail, Inbox, ArrowLeft, Heart, MessageCircle } from 'lucide-react'

const KEY = 'portfolio-admin-pass'
const getPass = () => {
  try { return sessionStorage.getItem(KEY) || '' } catch { return '' }
}
const setPass = (v) => {
  try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY) } catch { /* blocked */ }
}

async function api(pass, method = 'GET', id, path = 'messages') {
  const res = await fetch(`/api/${path}${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
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

// Gmail compose window, addressed to the sender, with their message quoted
const gmailReply = (m) => {
  const quoted = m.message.split('\n').map((l) => `> ${l}`).join('\n')
  const body = `\n\n\nOn ${when(m.t)}, ${m.name} <${m.email}> wrote:\n${quoted}`
  // authuser: open in the portfolio's Gmail account even if several are signed in
  const q = { authuser: profile.email, view: 'cm', fs: '1', to: m.email, su: 'Re: your message on my portfolio', body }
  return `https://mail.google.com/mail/?${Object.entries(q).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`
}

const when = (t) =>
  new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function Admin() {
  const [pass, setPassState] = useState(getPass)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(null)
  const [comments, setComments] = useState([])
  const [tab, setTab] = useState('messages')
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
      const [data, c] = await Promise.all([api(p), api(p, 'GET', null, 'comments?limit=100')])
      setMessages(data.messages)
      setComments(c.comments)
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

  const removeComment = async (c) => {
    if (!confirm(`Delete the comment from ${c.name}?`)) return
    try {
      await api(pass, 'DELETE', c.id, 'comments')
      setComments((list) => list.filter((x) => x.id !== c.id))
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
          <a className="admin-back" href="/"><ArrowLeft size={14} /> Back to site</a>
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
            <h1 className="sec-title">{tab === 'messages' ? 'Messages' : 'Comments'}</h1>
            <p className="sub">
              {tab === 'messages' ? `${messages.length} total · ${unread} unread` : `${comments.length} total`}
            </p>
          </div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={() => load(pass)} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
            </button>
            <button className="btn btn-ghost" onClick={logout}><LogOut size={15} /> Log out</button>
          </div>
        </header>

        <div className="admin-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'messages'} className={tab === 'messages' ? 'on' : ''} onClick={() => setTab('messages')}>
            <Mail size={15} /> Messages {unread > 0 && <span className="count">{unread}</span>}
          </button>
          <button role="tab" aria-selected={tab === 'comments'} className={tab === 'comments' ? 'on' : ''} onClick={() => setTab('comments')}>
            <MessageCircle size={15} /> Comments <span className="count dim">{comments.length}</span>
          </button>
        </div>

        {error && <p className="admin-error">{error}</p>}

        {tab === 'comments' ? (
          comments.length === 0 ? (
            <div className="panel-card admin-empty"><MessageCircle size={28} /><p>No comments yet.</p></div>
          ) : (
            <div className="admin-list">
              {comments.map((c) => (
                <div key={c.id} className="panel-card admin-cmt">
                  <div className="av">{c.name[0]}</div>
                  <div className="cmt-body">
                    <div className="cmt-head">
                      <b>{c.name}</b>
                      <time>{when(c.t)}</time>
                      <span className="cmt-likes"><Heart size={12} /> {c.likes || 0}</span>
                    </div>
                    <p>{c.text}</p>
                    {c.img && <img src={c.img} alt="" loading="lazy" />}
                  </div>
                  <button className="btn btn-ghost icon-btn" onClick={() => removeComment(c)} aria-label="Delete comment" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : messages.length === 0 ? (
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
                <div className="btn-row admin-actions">
                  <a className="btn btn-primary" href={gmailReply(m)} target="_blank" rel="noreferrer">
                    <Mail size={15} /> Open Gmail
                  </a>
                  <button className="btn btn-ghost icon-btn" onClick={() => remove(m)} aria-label="Delete message" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
