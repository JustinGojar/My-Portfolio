// ─────────────────────────────────────────────────────────────
//  Edit this file to make the portfolio yours.
//  Every section of the site reads from here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Justin Gojar',
  initials: 'JG',
  avatar: '/avatar.webp', // transparent-background photo in /public
  roles: ['Full-Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Creative Coder'],
  tagline:
    'I design and build fast, accessible and beautifully animated web experiences — from pixel-perfect interfaces to the APIs behind them.',
  location: 'Philippines',
  email: 'gojarjustin9@gmail.com',
  resumeUrl: '/resume.pdf', // drop your resume into /public/resume.pdf
  available: true,
  socials: {
    github: 'https://github.com/justingojar',
    linkedin: 'https://www.linkedin.com/in/justin-gojar-4b88583b3',
    facebook: 'https://www.facebook.com/gojar.justin',
  },
};

export const about = {
  paragraphs: [
    "Hi! I'm Justin, a developer who loves turning ideas into products people enjoy using. I care about clean code, thoughtful design and the small details — the micro-interactions that make an interface feel alive.",
    'I work across the stack: React on the front end, Node.js and serverless functions on the back end, and databases that keep everything in sync. I am always learning and always shipping.',
  ],
  stats: [
    { value: 3, suffix: '+', label: 'Years coding' },
    { value: 20, suffix: '+', label: 'Projects built' },
    { value: 10, suffix: '+', label: 'Technologies' },
    { value: 100, suffix: '%', label: 'Commitment' },
  ],
};

export const skills = [
  {
    group: 'Frontend',
    items: [
      { name: 'React', level: 90 },
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
      { name: 'Serverless (Netlify)', level: 80 },
      { name: 'PHP / Laravel', level: 70 },
    ],
  },
  {
    group: 'Tools & Data',
    items: [
      { name: 'Git & GitHub', level: 88 },
      { name: 'MySQL / PostgreSQL', level: 78 },
      { name: 'MongoDB / Firebase', level: 75 },
      { name: 'Figma', level: 80 },
    ],
  },
];

export const techMarquee = [
  'React', 'Vite', 'Node.js', 'Tailwind', 'Framer Motion', 'TypeScript', 'Express',
  'MongoDB', 'PostgreSQL', 'Firebase', 'Netlify', 'Git', 'Figma', 'Laravel',
];

// category is used by the filter buttons in the Projects section
export const projects = [
  {
    title: 'Bulan SeniorCare',
    category: 'Full-Stack',
    description:
      'A senior-citizen management system with records, benefits tracking and a dashboard for local government staff.',
    tags: ['React', 'Node.js', 'MySQL'],
    gradient: 'from-teal-400 via-cyan-500 to-indigo-500',
    live: '#',
    code: 'https://github.com/justingojar',
    featured: true,
  },
  {
    title: 'Motion Portfolio',
    category: 'Frontend',
    description:
      'This website — an animated, full-stack portfolio with serverless contact API, view counter and dark/light themes.',
    tags: ['React', 'Framer Motion', 'Vercel Functions'],
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    live: '#',
    code: 'https://github.com/justingojar/My-Portfolio',
    featured: true,
  },
  {
    title: 'TaskFlow',
    category: 'Full-Stack',
    description: 'A Kanban-style task manager with drag & drop, auth and real-time sync between devices.',
    tags: ['React', 'Firebase', 'Tailwind'],
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    live: '#',
    code: 'https://github.com/justingojar',
  },
  {
    title: 'WeatherNow',
    category: 'Frontend',
    description: 'A clean weather dashboard with 7-day forecast, geolocation and animated weather icons.',
    tags: ['JavaScript', 'API', 'CSS'],
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    live: '#',
    code: 'https://github.com/justingojar',
  },
  {
    title: 'ShopLite API',
    category: 'Backend',
    description: 'A RESTful e-commerce API with JWT auth, product catalog, cart and order endpoints.',
    tags: ['Node.js', 'Express', 'MongoDB'],
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    live: '#',
    code: 'https://github.com/justingojar',
  },
  {
    title: 'Mobile Landing UI',
    category: 'UI/UX',
    description: 'A high-converting landing page design system built in Figma and implemented responsively.',
    tags: ['Figma', 'Design System', 'HTML/CSS'],
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    live: '#',
    code: 'https://github.com/justingojar',
  },
];

export const experience = [
  {
    period: '2025 — Present',
    title: 'Freelance Full-Stack Developer',
    place: 'Remote',
    description: 'Building websites and web apps for small businesses and organizations, from design to deployment.',
  },
  {
    period: '2024 — 2025',
    title: 'Capstone Project Lead',
    place: 'University',
    description: 'Led a team building a full-stack management system; owned architecture, backend and deployment.',
  },
  {
    period: '2022 — Present',
    title: 'BS Information Technology',
    place: 'University',
    description: 'Focused on software engineering, databases, web development and human-computer interaction.',
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
