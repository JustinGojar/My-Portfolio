import { useEffect, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import { navLinks, profile } from '../data/portfolio.js';
import { FacebookIcon, GithubIcon, LinkedinIcon } from './Icons.jsx';

function useViews() {
  const [views, setViews] = useState(null);
  useEffect(() => {
    let counted = false;
    try {
      counted = sessionStorage.getItem('viewed') === '1';
      sessionStorage.setItem('viewed', '1');
    } catch {
      /* storage unavailable */
    }
    fetch('/api/views', { method: counted ? 'GET' : 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setViews(d.views))
      .catch(() => {});
  }, []);
  return views;
}

export default function Footer() {
  const views = useViews();
  return (
    <footer className="border-t border-line/10 py-10">
      <div className="container-x flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. Made with <Heart size={14} className="text-rose-500" fill="currentColor" />
        </p>
        <ul className="flex flex-wrap justify-center gap-5 text-sm text-muted">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="transition hover:text-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 text-muted">
          {views !== null && (
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <Eye size={14} /> {views.toLocaleString()} views
            </span>
          )}
          <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
            <GithubIcon />
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent">
            <LinkedinIcon />
          </a>
          <a href={profile.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-accent">
            <FacebookIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
