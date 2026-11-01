import { ArrowLeft, CodeXml, Layers, ExternalLink, Github, Sparkles } from 'lucide-react'
import Reveal from './Reveal.jsx'

export default function ProjectDetail({ project: p }) {
  const LinkBtn = ({ href, icon: Icon, label }) =>
    href ? (
      <a className="link-btn on" href={href} target="_blank" rel="noreferrer"><Icon size={14} /> {label}</a>
    ) : (
      <span className="link-btn off"><Icon size={14} /> No Link</span>
    )

  return (
    <div className="detail">
      <div className="container">
        <a className="back" href="#portfolio"><ArrowLeft size={15} /> Back</a>
        <div className="grid">
          <div>
            <Reveal as="h1">{p.title}</Reveal>
            <div className="underline" />
            <Reveal delay={100}>
              <p className="body">{p.description}</p>
              <div className="mini-stats">
                <div className="mini-stat">
                  <div className="ico"><CodeXml size={16} /></div>
                  <div><b>{p.tech.length}</b><small>Technologies Used</small></div>
                </div>
                <div className="mini-stat">
                  <div className="ico"><Layers size={16} /></div>
                  <div><b>{p.features.length}</b><small>Key Features</small></div>
                </div>
              </div>
              <div className="link-row">
                <LinkBtn href={p.live} icon={ExternalLink} label="Live Demo" />
                <LinkBtn href={p.repo} icon={Github} label="Source Code" />
              </div>
              <div className="h4"><CodeXml size={16} /> Technologies Used</div>
              <div className="chips">
                {p.tech.map((t) => <span className="chip-t" key={t}>{t}</span>)}
              </div>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="preview"><img src={p.image} alt={p.title} /></div>
            <div className="feature-box">
              <div className="h4"><Sparkles size={16} /> Key Features</div>
              <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
