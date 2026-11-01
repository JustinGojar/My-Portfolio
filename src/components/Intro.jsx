import { useEffect, useState } from 'react'
import { CodeXml, User, Globe } from 'lucide-react'
import { profile } from '../data.js'

export default function Intro({ onDone }) {
  const [out, setOut] = useState(false)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setOut(true), 3200)
    const t2 = setTimeout(() => {
      document.body.style.overflow = ''
      onDone()
    }, 4000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [onDone])

  const words = ['Welcome', 'to', 'my']
  const words2 = ['Portfolio', 'Website']
  return (
    <div className={`intro ${out ? 'out' : ''}`} onClick={() => setOut(true)}>
      <div>
        <div className="intro-icons">
          {[CodeXml, User, Globe].map((Icon, i) => (
            <div className="intro-icon" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <Icon size={18} />
            </div>
          ))}
        </div>
        <h1>
          {words.map((w, i) => (
            <span key={w} style={{ animationDelay: `${0.6 + i * 0.12}s` }}>{w}&nbsp;</span>
          ))}
          <br />
          {words2.map((w, i) => (
            <span key={w} className={i === 1 ? 'red' : ''} style={{ animationDelay: `${1 + i * 0.15}s` }}>
              {w}&nbsp;
            </span>
          ))}
        </h1>
        <div className="intro-url">{profile.siteUrl}</div>
      </div>
    </div>
  )
}
