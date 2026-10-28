// ─────────────────────────────────────────────────────────────
//  Edit this file to make the portfolio yours.
//  Every section of the site reads from here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Justin Gojar',
  initials: 'JG',
  avatar: '/avatar.webp', // transparent-background photo in /public
  roles: ['Frontend Developer', 'Fast Learner', 'Problem Solver', 'Creative Vibe Coder', 'Web Developer', 'App Developer', 'Tech Explorer', 'Digital Creator', 'Interface Innovator', 'Design Thinker'],
  tagline:
    'An aspiring web and app developer on a journey of learning, building, and growing. I turn ideas into simple, functional digital experiences while exploring new technologies and developing my skills one project at a time.',
  location: 'Bulan, Sorsogon, Philippines',
  email: 'gojarjustinofficial@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1zw_pVnevIn0RXR6srKPtU0FOe-DKivDc/view?usp=drive_link',
  available: true,
  socials: {
    github: 'https://github.com/justingojar',
    linkedin: 'https://www.linkedin.com/in/justin-gojar-4b88583b3',
    facebook: 'https://www.facebook.com/gojar.justin',
    telegram: 'https://t.me/parzival609',
  },
};

export const about = {
  paragraphs: [
    "Hi! I'm Justin, a developer who loves turning ideas into products people enjoy using. I care about clean code, thoughtful design and the small details — the micro-interactions that make an interface feel alive.",
    'I work across the stack: React on the front end, Node.js and serverless functions on the back end, and databases that keep everything in sync. I am always learning and always shipping.',
  ],
  stats: [
    { value: 3, suffix: '+', label: 'Years coding' },
    { value: 1, suffix: '', label: 'Projects built' },
    { value: 10, suffix: '+', label: 'Technologies' },
    { value: 100, suffix: '%', label: 'Commitment' },
  ],
};

export const skills = [
  {
    group: 'Frontend',
    items: [
      { name: 'React', level: 85 },
      { name: 'JavaScript / TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'HTML & CSS', level: 95 },
    ],
  },
  {
    group: 'Backend',
    items: [
      { name: 'Node.js / Express', level: 82 },
      { name: 'REST APIs', level: 85 },
      { name: 'PHP / Laravel', level: 76 },
    ],
  },
  {
    group: 'Tools & Data',
    items: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'ChatGPT/Claude', level: 95 },
      { name: 'Figma', level: 60 },
    ],
  },
];

export const techMarquee = [
  'React', 'Vite', 'Node.js', 'Tailwind', 'ClaudeCode/Codex', 'TypeScript', 'MySQL', 'Supabase', 'Vercel', 'Railway','Netlify', 'Git', 'Figma', 'Laravel',
];

// category is used by the filter buttons in the Projects section
export const projects = [
  {
    title: 'Bulan Senior Care',
    category: 'Full-Stack',
    description:
      'A senior-citizen management system with records, benefits tracking and a dashboard for local government staff.',
    tags: ['Vercel', 'Railway', 'React', 'Node.js', 'MySQL'],
    gradient: 'from-teal-400 via-cyan-500 to-indigo-500',
    image: '/projects/bulan-senior-care.webp',
    live: 'https://bulan-senior-care.vercel.app/',
    code: 'https://github.com/JustinGojar/Bulan_Senior_Care.git',
    featured: true,
  },
  {
    title: 'Equalize Gender',
        category: 'Front-End',
    description:
      'A gender awareness and inclusion platform on gender-based violence and harassment, built around official Philippine data and laws (RA 9262, RA 9710, RA 11313, RA 11596), with interactive statistics, a myth-or-fact quiz, and take-action resources.',
    tags: ['React', 'TypeScript', 'TanStack Start', 'Tailwind CSS', 'Chart.js', 'Vercel'],
    gradient: 'from-teal-400 via-cyan-500 to-indigo-500',
    image: '/projects/equalize-gender.webp',
    live: 'https://equalize-gender.vercel.app/',
    code: 'https://github.com/JustinGojar/Equalize-Gender.git',
    featured: true,
  },
];

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
    description: 'Focused on learning It fundamentals, software engineering, databases, app/web development and human-computer interaction.',
  },
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];
