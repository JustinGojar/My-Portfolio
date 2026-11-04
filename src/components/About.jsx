import { CodeXml, Award, Globe, ArrowUpRight, Eye } from 'lucide-react'
import Reveal from './Reveal.jsx'
import ParticlePortrait from './ParticlePortrait.jsx'
import { profile, projects, certificates } from '../data.js'

export default function About() {
  const parts = profile.name.split(' ')
  const last = parts.pop()
  const stats = [
    { icon: CodeXml, label: 'PROJECTS', num: projects.length, tab: 'projects' },
    { icon: Award, label: 'CERTIFICATES', num: certificates.length, tab: 'certificates' },
    { icon: Globe, label: 'COMPLETED WORKS', num: projects.filter((p) => p.live || p.repo).length || projects.length, tab: 'projects' },
  ]
  const goTab = (tab) => window.dispatchEvent(new CustomEvent('portfolio-tab', { detail: tab }))

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="grid">
          <div>
            <Reveal className="eyebrow">About me</Reveal>
            <Reveal as="h2" className="display" delay={100}>
              {parts.join(' ')} <span className="last">
                {last.split(/(j)/).map((c, i) => (c === 'j' ? <span key={i} className="glyph-j">j</span> : c))}
              </span>
            </Reveal>
            <Reveal delay={200}>
              {profile.about.map((t) => <p className="body" key={t}>{t}</p>)}
              <div className="quote">“{profile.quote}”</div>
              <div className="btn-row">
                <a className="btn btn-primary" href={profile.cv} target="_blank" rel="noreferrer">
                  <Eye size={15} /> View CV
                </a>
                <a className="btn btn-ghost" href="/portfolio" onClick={() => goTab('projects')}>
                  <ArrowUpRight size={15} /> View Projects
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="avatar-ring">
              <ParticlePortrait src={profile.photo} alt={profile.name} />
            </div>
          </Reveal>
        </div>

        <div className="stats">
          {stats.map(({ icon: Icon, label, num, tab }, i) => (
            <Reveal key={label} delay={i * 120}>
              <a className="stat" href="/portfolio" onClick={() => goTab(tab)}>
                <div className="ico"><Icon size={18} /></div>
                <div className="num">{num}</div>
                <div className="label">{label}</div>
                <ArrowUpRight className="arrow" size={16} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
