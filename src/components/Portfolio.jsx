import { useEffect, useState } from 'react'
import { ArrowRight, Link2, X } from 'lucide-react'
import Reveal from './Reveal.jsx'
import TechIcon from './TechIcon.jsx'
import { projects, certificates, techStack } from '../data.js'

const TABS = [
  ['projects', 'Projects'],
  ['certificates', 'Certificates'],
  ['tech', 'Tech Stack'],
]

export default function Portfolio() {
  const [tab, setTab] = useState('projects')
  const [cert, setCert] = useState(null)
  const idx = TABS.findIndex(([k]) => k === tab)

  // About-section stat cards can switch the tab
  useEffect(() => {
    const on = (e) => setTab(e.detail)
    window.addEventListener('portfolio-tab', on)
    return () => window.removeEventListener('portfolio-tab', on)
  }, [])

  useEffect(() => {
    if (!cert) return
    const esc = (e) => e.key === 'Escape' && setCert(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [cert])

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <Reveal className="center">
          <h2 className="sec-title">Portfolio <span className="red-text">Showcase</span></h2>
          <p className="sec-sub">Explore my journey through projects, certifications, and technical expertise.</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="tabs" role="tablist">
            <div className="tab-ind" style={{ transform: `translateX(${idx * 100}%)` }} />
            {TABS.map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        {tab === 'projects' && (
          <div className="cards panel" key="p">
            {projects.map((p) => (
              <article className="card" key={p.slug}>
                <div className="thumb"><img src={p.image} alt={p.title} loading="lazy" /></div>
                <h3>{p.title}</h3>
                <p>{p.short}</p>
                <div className="foot">
                  {p.live ? (
                    <a className="muted" href={p.live} target="_blank" rel="noreferrer"><Link2 size={13} /> Live Demo</a>
                  ) : (
                    <span className="muted">No Link</span>
                  )}
                  <a className="pill-btn" href={`/project/${p.slug}`}>Details <ArrowRight size={13} /></a>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === 'certificates' && (
          <div className="cards panel" key="c">
            {certificates.map((c) => (
              <button className="card cert" key={c.title} onClick={() => setCert(c)} style={{ textAlign: 'left' }}>
                <div className="thumb"><img src={c.image} alt={c.title} loading="lazy" /></div>
                <h3>{c.title}</h3>
                <p>{c.issuer}</p>
              </button>
            ))}
          </div>
        )}

        {tab === 'tech' && (
          <div className="tech-groups panel" key="t">
            {techStack.map((group, g) => (
              <div className="tech-group" key={group.category}>
                <h3 className="eyebrow tech-heading">{group.category}</h3>
                <div className="tech-grid">
                  {group.items.map((t, i) => (
                    <a
                      className="tech"
                      key={t.name}
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${t.name} official website`}
                      style={{ animationDelay: `${(g * 3 + i) * 40}ms` }}
                    >
                      <TechIcon name={t.icon} />
                      {t.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cert && (
        <div className="modal" onClick={() => setCert(null)}>
          <button className="close" aria-label="Close"><X size={18} /></button>
          <img src={cert.image} alt={cert.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}
