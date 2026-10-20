import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { experience } from '../data/portfolio.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });

  return (
    <section id="experience" className="relative py-28">
      <div className="container-x">
        <SectionHeading eyebrow="04 — Journey" title="Experience &" highlight="education" />

        <div ref={ref} className="relative mx-auto max-w-3xl">
          <div className="absolute left-5 top-0 h-full w-px bg-line/10 md:left-1/2" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-5 top-0 h-full w-px origin-top bg-gradient-to-b from-accent to-accent2 md:left-1/2"
          />

          <div className="space-y-12">
            {experience.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <div key={item.title} className={`relative flex ${left ? 'md:justify-start' : 'md:justify-end'}`}>
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute left-5 top-6 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border-4 border-paper bg-gradient-to-br from-accent to-accent2 text-white md:left-1/2"
                  >
                    <Briefcase size={14} />
                  </motion.span>
                  <Reveal x={left ? -50 : 50} y={0} className="w-full pl-14 md:w-[calc(50%-2.5rem)] md:pl-0">
                    <div className="glass p-6 transition hover:border-accent/40">
                      <p className="font-mono text-xs text-accent">{item.period}</p>
                      <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted">{item.place}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
