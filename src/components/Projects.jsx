import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import { projects } from '../data/portfolio.js';
import { GithubIcon } from './Icons.jsx';
import SectionHeading from './SectionHeading.jsx';

const categories = ['All', ...new Set(projects.map((p) => p.category))];

function TiltCard({ project }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(400px circle at ${x} ${y}, rgb(var(--accent) / 0.15), transparent 50%)`,
  );

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="glass group relative flex flex-col overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${project.gradient}`}>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} banner`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-3xl font-bold text-white/90 drop-shadow-lg transition-transform duration-700 group-hover:scale-110">
                {project.title}
              </span>
            </div>
          </>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Star size={12} fill="currentColor" /> Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow !tracking-[0.2em]">{project.category}</p>
        <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-line/10 px-3 py-1 font-mono text-[11px] text-muted">
              {t}
            </span>
          ))}
        </div>
        <div className="relative z-20 mt-5 flex gap-3">
          <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary !px-4 !py-2 !text-xs">
            Live demo <ArrowUpRight size={14} />
          </a>
          <a href={project.code} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !text-xs">
            <GithubIcon width={14} height={14} /> Code
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="03 — Work"
          title="Featured"
          highlight="projects"
          subtitle="A selection of things I've designed and built. Hover the cards — they move."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`relative rounded-full px-5 py-2 text-sm transition-colors ${
                filter === c ? 'text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {filter === c && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-accent to-accent2"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <TiltCard key={p.title} project={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
