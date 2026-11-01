# Justin L. Gojar — Portfolio (React + Vite)

Black + neon red portfolio: intro splash, draggable lanyard ID card, about,
tabbed showcase (Projects / Certificates / Tech Stack), project detail pages,
contact form and comment wall.

## Run it
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in /dist
```

## Make it yours
Everything you'll edit is in **`src/data.js`** (name, roles, about text, projects,
certificates, tech stack, social links).

- **Photo:** `public/avatar.webp` (set by `photo` in `src/data.js`).
  A portrait (4:5) crop looks best on the ID card.
- **CV:** drop your resume at `public/cv.pdf` for the Download CV button.
- **Certificates:** put scans in `public/certificates/` and list them in `certificates`.
- **Project screenshots:** put them in `public/projects/` and update each project's `image`.
- **Live / repo links:** fill `live` and `repo` on each project ("No Link" shows when empty).
- **Socials:** replace the URLs and handles in `socials`.
- **Colors:** all theme colors are CSS variables at the top of `src/styles.css` (`--red`, `--bg`, …).

## Notes
- The contact form opens the visitor's email app addressed to `profile.email`.
- Comments are saved in the visitor's own browser (localStorage). To share comments
  between all visitors, connect a backend such as Supabase or Firebase in
  `src/components/Contact.jsx`.

## Deploy to Vercel
Push to GitHub, import the repo on Vercel; it detects Vite automatically
(build: `npm run build`, output: `dist`).
# dev.portfolio

## Contact messages & admin page

The **Send Message** form posts to a Cloudflare Pages Function (`functions/api/messages.js`),
which stores each message in Cloudflare KV. Read them at **`/#/admin`**.

One-time setup in the Cloudflare dashboard:

1. **Storage & Databases → KV → Create** a namespace (e.g. `portfolio-messages`).
2. **Workers & Pages → gojar-portfolio → Settings → Bindings → Add → KV namespace**:
   variable name `MESSAGES`, pick the namespace. Do this for **Production** (and Preview if you want).
3. **Settings → Variables and secrets → Add**: type **Secret**, name `ADMIN_PASSWORD`, your password.
4. Redeploy (Deployments → latest production → Retry deployment).

Local test: `npm run build && npx wrangler pages dev dist --kv MESSAGES --binding ADMIN_PASSWORD=test`
