import { useEffect, useState } from 'react'
import { User, Mail, MessageSquare, Send, Upload, Heart, Pin, ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal.jsx'
import TechIcon from './TechIcon.jsx'
import { profile, socials } from '../data.js'

const KEY = 'portfolio-comments-v1'
const pinned = {
  id: 'pinned',
  name: profile.name,
  text: 'Thanks for stopping by! Feel free to leave a comment.',
  likes: 3,
  pinned: true,
}

// Comments are saved in this browser (localStorage). Hook up a backend
// (e.g. Supabase or Firebase) later if you want everyone to see them.
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
const save = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* storage full or blocked */ }
}

// shrink uploaded images so they fit in storage
const shrink = (file) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, 480 / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = img.width * scale
      c.height = img.height * scale
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      resolve(c.toDataURL('image/jpeg', 0.75))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })

const ago = (t) => {
  const s = (Date.now() - t) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function ContactForm({ toast }) {
  const [f, setF] = useState({ name: '', email: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio message from ${f.name}`)
    const body = encodeURIComponent(`${f.message}\n\n— ${f.name} (${f.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    toast('Opening your email app…')
    setF({ name: '', email: '', message: '' })
  }
  return (
    <form onSubmit={submit}>
      <div className="field"><User size={17} /><input required placeholder="Your Name" value={f.name} onChange={set('name')} /></div>
      <div className="field"><Mail size={17} /><input required type="email" placeholder="Your Email" value={f.email} onChange={set('email')} /></div>
      <div className="field"><MessageSquare size={17} /><textarea required placeholder="Your Message" value={f.message} onChange={set('message')} /></div>
      <button className="submit" type="submit"><Send size={16} /> Send Message</button>
    </form>
  )
}

function Comments({ toast }) {
  const [list, setList] = useState(load)
  const [liked, setLiked] = useState({})
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)

  useEffect(() => save(list), [list])

  const post = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setList([{ id: Date.now(), name: name.trim(), text: text.trim(), img, likes: 0, t: Date.now() }, ...list])
    setName('')
    setText('')
    setImg(null)
    toast('Comment posted!')
  }
  const like = (c) => {
    const on = !liked[c.id]
    setLiked({ ...liked, [c.id]: on })
    if (!c.pinned) setList(list.map((x) => (x.id === c.id ? { ...x, likes: x.likes + (on ? 1 : -1) } : x)))
  }

  const all = [pinned, ...list]
  return (
    <>
      <form onSubmit={post}>
        <div className="field plain"><input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} /></div>
        <div className="field plain"><textarea placeholder="Your Comment" value={text} onChange={(e) => setText(e.target.value)} maxLength={400} /></div>
        <label className="upload">
          <Upload size={16} /> Upload Image <small style={{ marginLeft: 'auto', color: 'var(--dim)' }}>optional</small>
          <input type="file" accept="image/*" onChange={async (e) => e.target.files[0] && setImg(await shrink(e.target.files[0]))} />
        </label>
        {img && (
          <div className="upload-prev"><img src={img} alt="" /> Image attached <button type="button" onClick={() => setImg(null)}>remove</button></div>
        )}
        <button className="submit" type="submit" disabled={!name.trim() || !text.trim()}>Post Comment</button>
      </form>

      <div className="comment-list">
        {all.map((c) => (
          <div key={c.id} className={`comment ${c.pinned ? 'pinned' : ''}`}>
            <div className="av">{c.name[0]}</div>
            <div className="body">
              <div className="who">
                {c.name}
                {c.pinned && <span className="badge"><Pin size={9} /> PINNED</span>}
                {c.t && <span className="when">{ago(c.t)}</span>}
              </div>
              <div className="text">{c.text}</div>
              {c.img && <img className="img" src={c.img} alt="" />}
            </div>
            <button className={`like ${liked[c.id] ? 'on' : ''}`} onClick={() => like(c)} aria-label="Like">
              <Heart size={13} /> {c.likes + (c.pinned && liked[c.id] ? 1 : 0)}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default function Contact() {
  const [msg, setMsg] = useState('')
  const toast = (m) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 2400)
  }
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="center">
          <h2 className="sec-title">Contact <span className="red-text">Me</span></h2>
          <p className="sec-sub">Have something in mind? Send a message and let's connect.</p>
        </Reveal>

        <div className="grid">
          <Reveal className="panel-card">
            <h3>Get in Touch</h3>
            <p className="sub">Feel free to reach out if you want to collaborate, discuss ideas, or simply say hello.</p>
            <ContactForm toast={toast} />
            <div className="divider" />
            <div className="connect-title">Connect With Me</div>
            <div className="socials">
              {socials.map((s) => (
                <a key={s.name} className={`social ${s.wide ? 'wide' : ''}`} href={s.url} target="_blank" rel="noreferrer">
                  <TechIcon name={s.icon} className="main" />
                  <div><b>{s.name}</b><small>{s.handle}</small></div>
                  <ArrowUpRight className="go" size={15} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="panel-card" delay={120}>
            <h3>Comments</h3>
            <p className="sub">Leave your thoughts here</p>
            <Comments toast={toast} />
          </Reveal>
        </div>
      </div>
      {msg && <div className="toast">{msg}</div>}
    </section>
  )
}
