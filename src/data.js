// ─────────────────────────────────────────────────────────────
//  EDIT YOUR CONTENT HERE. Every section of the site reads from this file.
//  Images live in /public.
// ─────────────────────────────────────────────────────────────

export const profile = {
  brand: 'gojar.portfolio',
  siteUrl: 'gojar-portfolio.pages.dev',
  name: 'Justin L. Gojar',
  firstName: 'Justin',
  photo: '/avatar.webp',
  cv: 'https://drive.google.com/file/d/1mRELQQ7i9zHVEPE7eDc5N3Xen0ZmaVJ1/view?usp=sharing',
  email: 'gojarjustinofficial@gmail.com',
  location: 'Bulan, Sorsogon, Philippines',
  headline: ['Welcome to', 'My Portfolio'],
  cardRole: 'QA Tester', // small text on the ID card
  roles: [
    'QA Tester',
    'Manual Tester',
    'Bug Hunter',
    'Test Case Writer',
    'API Tester',
    'Performance Tester',
    'Security Tester',
    'Detail-Oriented',
    'Quality Advocate',
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
    "Hi! I'm Justin, a QA tester who makes sure software works the way people expect it to. I test web apps end to end, from UI details and user flows to APIs, performance and security, and I document every bug clearly so it gets fixed fast.",
  about: [
    'An aspiring QA tester and IT student at Sorsogon State University - Bulan Campus in Bulan, Sorsogon, on a journey of learning, testing and growing. I care about quality: catching bugs early, writing clear test cases and making sure every feature works for everyone who uses it.',
    'On my capstone project, Bulan Senior Care, I handled testing across the system: API checks with Postman and end-to-end browser testing with Playwright. I also build with React, so I understand the code behind what I test.',
  ],
  quote: 'Quality is not an accident. I test every detail so it works for everyone who uses it.',
}

export const projects = [
  {
    slug: 'bulan-seniorcare',
    title: 'Bulan Senior Care',
    category: 'Full-Stack',
    image: '/projects/bulan-senior-care.webp',
    // slides for the project page carousel (the card on the Portfolio tab uses `image`)
    gallery: [
      { src: '/projects/bulan-senior-care.webp', alt: 'Bulan SeniorCare banner', caption: 'Bulan SeniorCare' },
      { src: '/projects/bulan-senior-care/bulan-aerial.webp', alt: 'Aerial view of Bulan, Sorsogon', caption: 'Bulan, Sorsogon' },
      { src: '/projects/bulan-senior-care/seniors.webp', alt: 'Senior citizens of Bulan', caption: 'Senior citizens of Bulan' },
      { src: '/projects/bulan-senior-care/osca-staff.webp', alt: 'OSCA Bulan staff', caption: 'OSCA Bulan staff', position: 'center 30%' },
    ],
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

// Grouped by category; icon keys map to logos in components/TechIcon.jsx
export const techStack = [
  {
    category: 'Frontend Frameworks',
    items: [
      { name: 'HTML', icon: 'html', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'CSS', icon: 'css', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { name: 'JavaScript', icon: 'js', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'TypeScript', icon: 'ts', url: 'https://www.typescriptlang.org' },
      { name: 'Tailwind CSS', icon: 'tailwind', url: 'https://tailwindcss.com' },
      { name: 'React', icon: 'react', url: 'https://react.dev' },
      { name: 'Vite', icon: 'vite', url: 'https://vite.dev' },
    ],
  },
  {
    category: 'Backend Frameworks & Data',
    items: [
      { name: 'Python', icon: 'python', url: 'https://www.python.org' },
      { name: 'MySQL', icon: 'mysql', url: 'https://www.mysql.com' },
      { name: 'PHP', icon: 'php', url: 'https://www.php.net' },
      { name: 'Laravel', icon: 'laravel', url: 'https://laravel.com' },
      { name: 'Node.js', icon: 'node', url: 'https://nodejs.org' },
      { name: 'Express', icon: 'express', url: 'https://expressjs.com' },
    ],
  },
  {
    category: 'Testing',
    items: [
      { name: 'Postman', icon: 'postman', url: 'https://www.postman.com' },
      { name: 'Playwright', icon: 'playwright', url: 'https://playwright.dev' },
    ],
  },
  {
    category: 'Hosting & Deployment',
    items: [
      { name: 'Vercel', icon: 'vercel', url: 'https://vercel.com' },
      { name: 'Railway', icon: 'railway', url: 'https://railway.com' },
      { name: 'Netlify', icon: 'netlify', url: 'https://www.netlify.com' },
      { name: 'Cloudflare', icon: 'cloudflare', url: 'https://www.cloudflare.com' },
      { name: 'Supabase', icon: 'supabase', url: 'https://supabase.com' },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Git', icon: 'git', url: 'https://git-scm.com' },
      { name: 'GitHub', icon: 'github', url: 'https://github.com' },
      { name: 'Figma', icon: 'figma', url: 'https://www.figma.com' },
      { name: 'Claude Code', icon: 'claude', url: 'https://claude.com/product/claude-code' },
      { name: 'Codex', icon: 'codex', url: 'https://openai.com/codex' },
      { name: 'Docker', icon: 'docker', url: 'https://www.docker.com' },
      { name: 'XAMPP', icon: 'xampp', url: 'https://www.apachefriends.org' },
      { name: 'VS Code', icon: 'vscode', url: 'https://code.visualstudio.com' },
      { name: 'Cursor', icon: 'cursor', url: 'https://cursor.com' },
    ],
  },
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
