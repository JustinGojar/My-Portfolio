import { motion } from 'framer-motion';
import { skills } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function Skills() {
  return (
    <section id="skills" className="relative py-28">
      <div className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-accent2/10 blur-[120px]" />
      <div className="container-x">
        <SectionHeading
          eyebrow="02 — Skills"
          title="My"
          highlight="toolbox"
          subtitle="Technologies I use to bring ideas to life, from the first sketch to production."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 0.12}>
              <div className="glass h-full p-7">
                <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {g.group}
                </h3>
                <ul className="space-y-5">
                  {g.items.map((s, i) => (
                    <li key={s.name}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="font-mono text-muted">{s.level}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-line/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
