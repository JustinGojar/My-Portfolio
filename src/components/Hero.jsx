import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, MapPin, Send } from 'lucide-react';
import { profile, techMarquee } from '../data/portfolio.js';
import { FacebookIcon, GithubIcon, LinkedinIcon } from './Icons.jsx';

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={profile.roles[i]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient whitespace-nowrap"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const word = {
  hidden: { y: '110%' },
  show: (i) => ({ y: 0, transition: { delay: 0.15 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Hero({ ready }) {
  const { scrollY } = useScroll();
  const yOrb = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const state = ready ? 'show' : 'hidden';
  const words = `Hi, I'm ${profile.name}`.split(' ');

  const socials = [
    { href: profile.socials.github, Icon: GithubIcon, label: 'GitHub' },
    { href: profile.socials.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
    { href: profile.socials.facebook, Icon: FacebookIcon, label: 'Facebook' },
  ];

  return (
    <section id="home" className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-28">
      {/* animated background */}
      <div className="grid-bg absolute inset-0 -z-10" />
      <motion.div style={{ y: yOrb }} className="absolute inset-0 -z-10">
        <div className="absolute -left-32 top-20 h-96 w-96 animate-float rounded-full bg-accent/25 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-[28rem] w-[28rem] animate-float rounded-full bg-accent2/25 blur-[120px] [animation-delay:-3s]" />
      </motion.div>

      <motion.div style={{ opacity }} className="container-x grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.available ? 'Available for work' : 'Currently busy'}
          </motion.div>

          <h1 className="text-4xl font-bold leading-[1.1] sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-1">
                <motion.span custom={i} variants={word} initial="hidden" animate={state} className="inline-block">
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-4 text-2xl font-semibold sm:text-3xl"
          >
            <RotatingRole />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a href="#contact" className="btn-primary">
              <Send size={16} /> Let's talk
            </a>
            <a href={profile.resumeUrl} download className="btn-ghost">
              <Download size={16} /> Resume
            </a>
            <div className="flex items-center gap-2 sm:ml-2">
              {socials.map(({ href, Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -4, rotate: -6 }}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line/10 text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* avatar card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <div className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,rgb(var(--accent)),rgb(var(--accent2)),transparent,rgb(var(--accent)))] p-[2px]">
            <div className="h-full w-full rounded-full bg-paper" />
          </div>
          <div className="absolute inset-6 overflow-hidden rounded-full bg-gradient-to-br from-accent/30 to-accent2/30">
            <img
              src={profile.avatar}
              alt={profile.name}
              width={800}
              height={800}
              className="h-full w-full translate-y-[6%] scale-110 object-cover object-top"
            />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="glass absolute -left-2 top-10 px-4 py-3 text-sm shadow-xl"
          >
            <p className="font-mono text-xs text-muted">status</p>
            <p className="font-semibold">Building cool stuff 🚀</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="glass absolute -right-2 bottom-10 flex items-center gap-2 px-4 py-3 text-sm shadow-xl"
          >
            <MapPin size={16} className="text-accent" /> {profile.location}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* tech marquee */}
      <div className="relative mt-20 overflow-hidden border-y border-line/10 py-5 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-12">
          {[...techMarquee, ...techMarquee].map((t, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-xl font-semibold text-muted/70">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mx-auto my-8 grid h-12 w-7 place-items-start justify-center rounded-full border-2 border-line/20 pt-2 text-muted"
      >
        <ArrowDown size={14} />
      </motion.a>
    </section>
  );
}
