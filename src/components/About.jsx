import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { Code2, Palette, Rocket, Server } from 'lucide-react';
import { about } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const services = [
  { Icon: Code2, title: 'Frontend', text: 'Responsive, accessible interfaces with smooth motion.' },
  { Icon: Server, title: 'Backend', text: 'APIs, databases and serverless functions that scale.' },
  { Icon: Palette, title: 'UI / UX', text: 'Clean visual design rooted in real user needs.' },
  { Icon: Rocket, title: 'Deployment', text: 'CI/CD, performance tuning and hosting on the edge.' },
];

export default function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="container-x">
        <SectionHeading eyebrow="01 — About" title="A little" highlight="about me" />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1} x={-30} y={0}>
                <p>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
                {about.stats.map((s) => (
                  <div key={s.label} className="glass p-4 text-center">
                    <p className="text-gradient font-display text-3xl font-bold">
                      <Counter value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div className="glass group h-full p-6 transition duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent2/20 text-accent transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
