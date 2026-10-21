# Justin Gojar — Portfolio

An animated developer portfolio built with **React + Vite + Tailwind CSS + Framer Motion**.

## Features

**Frontend (motion & UI)**
- Animated preloader, scroll-progress bar, cursor glow, and noise/grid backgrounds
- Hero with word-by-word reveal, rotating role text, parallax orbs, a spinning gradient avatar ring and a tech marquee
- Scroll-triggered reveals, animated stat counters and skill bars
- Project grid with category filters (animated layout) and 3D tilt + spotlight cards
- Scroll-drawn timeline for experience/education
- Dark/light theme toggle (saved per browser), responsive mobile menu, back-to-top button
- Respects `prefers-reduced-motion`

## Make it yours

All content lives in **`src/data/portfolio.js`**: name, roles, bio, stats, skills, projects, experience and social links.
- Resume: add `public/resume.pdf`
- Photo: add `public/avatar.jpg` and swap the initials block in `src/components/Hero.jsx` for an `<img>`
- Colors: edit the CSS variables `--accent` / `--accent2` in `src/index.css`

## Run locally

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in dist/
```
