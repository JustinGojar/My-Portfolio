import { GraduationCap } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { experience } from '../data.js'

export default function Journey() {
  return (
    <section id="journey" className="section journey">
      <div className="container">
        <Reveal className="center">
          <h2 className="sec-title">My <span className="red-text">Journey</span></h2>
          <p className="sec-sub">Experience and education that shaped how I build.</p>
        </Reveal>

        <div className="timeline">
          {experience.map((item, i) => (
            <Reveal className="tl-item" key={item.title} delay={i * 120}>
              <span className="tl-dot"><GraduationCap size={14} /></span>
              <div className="panel-card">
                <div className="tl-period">{item.period}</div>
                <h3>{item.title}</h3>
                <div className="tl-place">{item.place}</div>
                <p>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
