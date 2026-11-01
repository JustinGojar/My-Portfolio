// ─────────────────────────────────────────────────────────────
//  EDIT YOUR CONTENT HERE. Every section of the site reads from this file.
//  Images live in /public.
// ─────────────────────────────────────────────────────────────

export const profile = {
  brand: 'justin.dev',
  siteUrl: 'gojar-portfolio.pages.dev',
  name: 'Justin L. Gojar',
  firstName: 'Justin',
  photo: '/avatar.webp',
  cv: 'https://drive.google.com/file/d/1ikbMO7qcCj4WtOh6mGd_f_5qoWk_3JcL/view?usp=drivesdk',
  email: 'gojarjustinofficial@gmail.com',
  location: 'Bulan, Sorsogon, Philippines',
  headline: ['QA', 'Tester'],
  cardRole: 'Frontend Dev · Web & App', // small text on the ID card
  roles: [
    'Frontend Developer',
    'Fast Learner',
    'Problem Solver',
    'Creative Vibe Coder',
    'Web Developer',
    'App Developer',
    'Tech Explorer',
    'Digital Creator',
    'Interface Innovator',
    'Design Thinker',
  ],
  heroText:
    "Hi! I'm Justin, a developer who loves turning ideas into products people enjoy using. I care about clean code, thoughtful design and the small details — the micro-interactions that make an interface feel alive.",
  about: [
    'An aspiring web and app developer on a journey of learning, building, and growing. I turn ideas into simple, functional digital experiences while exploring new technologies and developing my skills one project at a time.',
    'I work across the stack: React on the front end, Node.js and serverless functions on the back end, and databases that keep everything in sync. I am always learning and always shipping.',
  ],
  quote: 'Turning ideas into simple, functional and meaningful digital experiences.',
}

export const projects = [
  {
    slug: 'bulan-seniorcare',
    title: 'Bulan Senior Care',
    category: 'Full-Stack',
    image: '/projects/bulan-senior-care.webp',
    short:
      'A senior-citizen management system with records, benefits tracking and a dashboard for local government staff.',
    description:
      'Bulan Senior Care is a senior-citizen management system built for the Office of Senior Citizen Affairs (OSCA) of the Local Government Unit of Bulan, Sorsogon. It digitizes senior citizen records and benefits tracking, and gives local government staff a dashboard to manage everything in one place.',
    tech: ['React', 'Node.js', 'MySQL', 'Vercel', 'Railway'],
    features: [
      'Senior citizen records management',
      'Benefits tracking',
      'Dashboard for local government staff',
      'Role-based access for staff accounts',
    ],
    live: 'https://bulan-senior-care.vercel.app/',
    repo: 'https://github.com/JustinGojar/Bulan_Senior_Care',
  },
  {
    slug: 'equalize',
    title: 'Equalize Gender',
    category: 'Front-End',
    image: '/projects/equalize-gender.webp',
    short:
      'A gender awareness and inclusion platform on gender-based violence and harassment, built around official Philippine data and laws.',
    description:
      'A gender awareness and inclusion platform on gender-based violence and harassment, built around official Philippine data and laws (RA 9262, RA 9710, RA 11313, RA 11596), with interactive statistics, a myth-or-fact quiz, and take-action resources.',
    tech: ['React', 'TypeScript', 'TanStack Start', 'Tailwind CSS', 'Chart.js', 'Vercel'],
    features: [
      'Interactive statistics built on official Philippine data',
      'Myth-or-fact quiz',
      'Plain-language guides to RA 9262, RA 9710, RA 11313 and RA 11596',
      'Take-action resources',
    ],
    live: 'https://equalize-gender.vercel.app/',
    repo: 'https://github.com/JustinGojar/Equalize-Gender',
  },
]

export const certificates = [
  { title: 'Certificate of Completion', issuer: 'Your Issuing Organization', image: '/certificates/certificate-1.svg' },
  { title: 'Certificate of Participation', issuer: 'Your Seminar / Workshop', image: '/certificates/certificate-2.svg' },
]

// icon keys map to logos in components/TechIcon.jsx
export const techStack = [
  { name: 'React', icon: 'react' },
  { name: 'JavaScript', icon: 'js' },
  { name: 'TypeScript', icon: 'ts' },
  { name: 'HTML', icon: 'html' },
  { name: 'CSS', icon: 'css' },
  { name: 'Tailwind CSS', icon: 'tailwind' },
  { name: 'Vite', icon: 'vite' },
  { name: 'Node.js', icon: 'node' },
  { name: 'Express', icon: 'express' },
  { name: 'PHP', icon: 'php' },
  { name: 'Laravel', icon: 'laravel' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'Railway', icon: 'railway' },
  { name: 'Netlify', icon: 'netlify' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Claude Code / Codex', icon: 'claude' },
]

export const experience = [
  {
    period: '2024 — 2026',
    title: 'Capstone Project',
    place: 'Sorsogon State University - Bulan Campus',
    description: 'Led a team building a full-stack government system; owned architecture, frontend, backend and deployment.',
  },
  {
    period: '2023 — Present',
    title: 'BS Information Technology',
    place: 'Sorsogon State University - Bulan Campus',
    description: 'Focused on learning IT fundamentals, software engineering, databases, app/web development and human-computer interaction.',
  },
]

export const socials = [
  { name: 'GitHub', handle: '@justingojar', url: 'https://github.com/justingojar', icon: 'github' },
  { name: 'LinkedIn', handle: 'Justin Gojar', url: 'https://www.linkedin.com/in/justin-gojar-4b88583b3', icon: 'linkedin' },
  { name: 'Facebook', handle: '@gojar.justin', url: 'https://www.facebook.com/gojar.justin', icon: 'facebook' },
  { name: 'Telegram', handle: '@parzival609', url: 'https://t.me/parzival609', icon: 'telegram' },
  { name: 'Email', handle: 'gojarjustinofficial@gmail.com', url: 'mailto:gojarjustinofficial@gmail.com', icon: 'email', wide: true },
]
