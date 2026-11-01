// ─────────────────────────────────────────────────────────────
//  EDIT YOUR CONTENT HERE. Every section of the site reads from this file.
//  Images live in /public. Swap profile.svg for your own photo
//  (e.g. drop in profile.jpg and change `photo` below).
// ─────────────────────────────────────────────────────────────

export const profile = {
  brand: 'justin.dev',
  siteUrl: 'www.justin-gojar.vercel.app',
  name: 'Justin L. Gojar',
  firstName: 'Justin',
  photo: '/profile.svg',
  cv: '/cv.pdf', // put your CV in /public/cv.pdf
  email: 'gojarjustin9@gmail.com',
  location: 'Sorsogon, Philippines',
  headline: ['Frontend', 'Developer'],
  cardRole: 'Frontend Dev · QA', // small text on the ID card
  roles: ['QA Tester', 'Frontend Developer', 'Fresh Grad', 'Happy coding!'],
  heroText:
    'Building modern websites with clean, responsive and elegant interfaces, and testing them until they work for everyone who uses them.',
  heroTags: ['React.js', 'Laravel', 'QA Testing'],
  aboutText:
    'Student developer from Sorsogon, Philippines with a passion for frontend development and software quality assurance. I build clean, responsive web apps and test them end to end: from UI details to API checks, performance and security.',
  quote: 'Turning ideas into clean, tested and meaningful digital experiences.',
}

export const projects = [
  {
    slug: 'bulan-seniorcare',
    title: 'Bulan SeniorCare',
    image: '/projects/bulan-seniorcare.svg',
    short:
      'OSCA Assistant Management System for LGU-Bulan, Sorsogon. Manages senior citizen records, benefits and reports with role-based access.',
    description:
      'Bulan SeniorCare is an Office of Senior Citizen Affairs (OSCA) Assistant Management System built for the Local Government Unit of Bulan, Sorsogon. It digitizes senior citizen records, benefit tracking and report approval, with access separated between Admin, Head and Leader roles. Built with RAD methodology and evaluated against ISO/IEC 25010.',
    tech: ['Laravel 11', 'React', 'MySQL', 'Sanctum', 'Spatie Roles'],
    features: [
      'Role-based access for Admin, Head and Leader',
      'Senior citizen records and benefit tracking',
      'Report workflow: For Review, Returned, Approved, Published',
      'Telegram bot notifications',
      'OWASP Top 10 security assessment and Data Privacy Act compliance',
      'Tested with Postman, JMeter, Lighthouse and OWASP ZAP',
    ],
    live: '',
    repo: '',
  },
  {
    slug: 'equalize',
    title: 'EQUALIZE',
    image: '/projects/equalize.svg',
    short:
      'Gender awareness and inclusion platform for the Philippines with quizzes, statistics dashboards and legal guides.',
    description:
      'EQUALIZE is an interactive gender awareness and inclusion platform for the Philippines. It combines quizzes, statistics dashboards built on verified PSA and PCW data, plain-language summaries of RA 9710, RA 9262 and RA 11313, and a resource finder.',
    tech: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Chart.js'],
    features: [
      'Interactive quizzes',
      'Statistics dashboards with verified data',
      'Legal summaries of RA 9710, 9262 and 11313',
      'Resource finder',
    ],
    live: '',
    repo: '',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio Website',
    image: '/projects/portfolio.svg',
    short:
      'This site: a dark, neon red portfolio with a swinging ID card, tabbed showcase and a comment wall.',
    description:
      'My personal portfolio built in React. It features an intro splash, a draggable lanyard ID card with spring physics, a tabbed showcase for projects, certificates and tech stack, and a contact section with a comment wall.',
    tech: ['React', 'Vite', 'CSS'],
    features: ['Fully animated', 'Draggable lanyard ID card', 'Responsive on every screen'],
    live: '',
    repo: '',
  },
]

export const certificates = [
  { title: 'Certificate of Completion', issuer: 'Your Issuing Organization', image: '/certificates/certificate-1.svg' },
  { title: 'Certificate of Participation', issuer: 'Your Seminar / Workshop', image: '/certificates/certificate-2.svg' },
]

// icon keys map to logos in components/TechIcon.jsx
export const techStack = [
  { name: 'React.js', icon: 'react' },
  { name: 'JavaScript', icon: 'js' },
  { name: 'HTML', icon: 'html' },
  { name: 'CSS', icon: 'css' },
  { name: 'Tailwind', icon: 'tailwind' },
  { name: 'PHP', icon: 'php' },
  { name: 'Laravel', icon: 'laravel' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'Vite', icon: 'vite' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Postman', icon: 'postman' },
  { name: 'Figma', icon: 'figma' },
]

export const socials = [
  { name: 'LinkedIn', handle: '@justingojar', url: 'https://www.linkedin.com/', icon: 'linkedin', wide: true },
  { name: 'Instagram', handle: '@instagram', url: 'https://www.instagram.com/', icon: 'instagram' },
  { name: 'Youtube', handle: '@youtube', url: 'https://www.youtube.com/', icon: 'youtube' },
  { name: 'Github', handle: '@github', url: 'https://github.com/', icon: 'github' },
  { name: 'TikTok', handle: '@tiktok', url: 'https://www.tiktok.com/', icon: 'tiktok' },
]
