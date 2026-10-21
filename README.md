# Justin Gojar — Portfolio

A full-stack, animated developer portfolio built with **React + Vite + Tailwind CSS + Framer Motion**, with a serverless backend on **Vercel Functions + Upstash Redis**.

## Features

**Frontend (motion & UI)**
- Animated preloader, scroll-progress bar, cursor glow, and noise/grid backgrounds
- Hero with word-by-word reveal, rotating role text, parallax orbs, a spinning gradient avatar ring and a tech marquee
- Scroll-triggered reveals, animated stat counters and skill bars
- Project grid with category filters (animated layout) and 3D tilt + spotlight cards
- Scroll-drawn timeline for experience/education
- Dark/light theme toggle (saved per browser), responsive mobile menu, back-to-top button
- Respects `prefers-reduced-motion`

**Backend (Vercel Functions in `api/`)**
| Endpoint | Method | What it does |
|---|---|---|
| `/api/contact` | POST | Validates and stores contact messages (honeypot + 5/hour per-IP rate limit). Optionally emails you through Resend. |
| `/api/messages` | GET / PATCH / DELETE | Private inbox API, protected by `ADMIN_TOKEN` |
| `/api/views` | GET / POST | Site view counter shown in the footer |

**Admin inbox**: open `/admin` on your site and enter your `ADMIN_TOKEN` to read, mark as read and delete messages.

## Make it yours

All content lives in **`src/data/portfolio.js`**: name, roles, bio, stats, skills, projects, experience and social links.
- Resume: add `public/resume.pdf`
- Photo: add `public/avatar.jpg` and swap the initials block in `src/components/Hero.jsx` for an `<img>`
- Colors: edit the CSS variables `--accent` / `--accent2` in `src/index.css`

## Run locally

```bash
npm install
npm run dev            # frontend only, http://localhost:5173 (API calls will 404)
npx vercel dev         # frontend + functions, http://localhost:3000 (needs the env vars below in .env.local)
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project →** import this repo. Build settings come from `vercel.json` (Vite, `npm run build`, output `dist`).
3. In the project's **Storage** tab, add **Upstash Redis** (from the Marketplace) and connect it to the project. This sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
4. In **Settings → Environment Variables** add:
   - `ADMIN_TOKEN`: a long random string (required for `/admin`)
   - Optional email notifications: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
5. Redeploy so the functions pick up the variables.

See `.env.example` for all variables.
