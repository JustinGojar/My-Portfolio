import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data.js'

const links = [
  ['home', 'Home'],
  ['about', 'About'],
  ['portfolio', 'Portfolio'],
  ['contact', 'Contact'],
]

export default function Navbar() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    links.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const [name, tld] = profile.brand.split('.')
  return (
    <nav className={`nav ${open ? 'open' : ''}`}>
      <a href="#home" className="brand">
        {name}<b>.</b>{tld}
      </a>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className="nav-links">
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
