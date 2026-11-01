import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import Lanyard from './Lanyard.jsx'
import Reveal from './Reveal.jsx'
import { FaGithub, FaLinkedin, FaFacebook, FaTelegram } from 'react-icons/fa'
import { profile, socials } from '../data.js'

const heroIcons = { github: FaGithub, linkedin: FaLinkedin, facebook: FaFacebook, telegram: FaTelegram }

function useTypewriter(words) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[i % words.length]
    let t
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), 1600)
    else if (deleting && text === '') {
      setDeleting(false)
      setI(i + 1)
    } else
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 45 : 95
      )
    return () => clearTimeout(t)
  }, [text, deleting, i, words])
  return text
}

export default function Hero() {
  const typed = useTypewriter(profile.roles)
  return (
    <section id="home" className="section hero">
      <div className="container">
        <div>
          <Reveal className="eyebrow"><span className="dot" />Available for work</Reveal>
          <Reveal as="h1" className="display" delay={120}>
            {profile.headline[0]}
            <span className="line2">{profile.headline[1]}</span>
          </Reveal>
          <Reveal delay={240}>
            <div className="typer">{typed}<span className="caret">_</span></div>
            <p className="lead">{profile.heroText}</p>
            <div className="hero-socials">
              {socials.filter((s) => heroIcons[s.icon]).map((s) => {
                const Icon = heroIcons[s.icon]
                return (
                  <a key={s.name} className="hero-social" href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name}>
                    <Icon />
                  </a>
                )
              })}
            </div>
            <div className="mono-notes">
              <div><span>↓</span> explore my work below</div>
              <div><span>↗</span> open to full-time &amp; freelance opportunities</div>
            </div>
          </Reveal>
        </div>
        <Lanyard />
      </div>
      <a href="/about" className="scroll-hint">SCROLL <ArrowDown size={14} /></a>
    </section>
  )
}
