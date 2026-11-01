import {
  SiReact, SiJavascript, SiTypescript, SiHtml5, SiCss, SiTailwindcss, SiPhp, SiLaravel, SiMysql,
  SiVite, SiGit, SiGithub, SiPostman, SiFigma, SiInstagram, SiYoutube, SiTiktok, SiNextdotjs,
  SiNodedotjs, SiExpress, SiSupabase, SiVercel, SiRailway, SiNetlify, SiClaude, SiFacebook, SiTelegram,
} from 'react-icons/si'
import { Linkedin, Mail } from 'lucide-react'

// Codex has no react-icons entry: outlined cloud with a terminal prompt.
function CodexIcon({ color = 'currentColor', ...props }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.08 9.06L20.69 9.34L21.10 9.73L21.44 10.17L21.71 10.64L21.92 11.13L22.07 11.65L22.15 12.18L22.17 12.71L22.12 13.24L22.01 13.76L21.83 14.27L21.59 14.75L21.30 15.20L20.94 15.61L20.53 15.98L20.06 16.29L19.48 16.49L19.42 17.00L19.34 17.53L19.19 18.03L18.98 18.51L18.72 18.96L18.41 19.37L18.06 19.75L17.66 20.09L17.23 20.38L16.78 20.62L16.30 20.81L15.80 20.95L15.28 21.03L14.77 21.05L14.25 21.01L13.73 20.90L13.22 20.68L12.79 20.99L12.33 21.37L11.83 21.65L11.31 21.85L10.77 21.98L10.23 22.04L9.69 22.03L9.15 21.94L8.63 21.80L8.13 21.58L7.66 21.30L7.23 20.97L6.85 20.58L6.51 20.14L6.24 19.65L6.03 19.11L5.93 18.51L5.61 18.17L5.08 18.01L4.61 17.78L4.17 17.48L3.77 17.14L3.41 16.76L3.11 16.34L2.85 15.89L2.64 15.41L2.49 14.91L2.40 14.39L2.36 13.87L2.39 13.35L2.48 12.83L2.62 12.33L2.84 11.84L3.14 11.38L3.20 10.92L2.92 10.40L2.76 9.87L2.67 9.33L2.66 8.78L2.71 8.25L2.83 7.73L3.02 7.22L3.26 6.75L3.56 6.30L3.91 5.90L4.30 5.54L4.74 5.23L5.22 4.98L5.73 4.79L6.27 4.67L6.85 4.64L7.36 4.58L7.62 4.10L7.95 3.70L8.32 3.34L8.74 3.03L9.18 2.77L9.65 2.56L10.13 2.40L10.64 2.30L11.15 2.24L11.66 2.25L12.17 2.31L12.67 2.42L13.16 2.58L13.62 2.80L14.06 3.08L14.46 3.42L14.84 3.76L15.41 3.56L15.96 3.50L16.50 3.53L17.03 3.63L17.54 3.78L18.03 4.00L18.48 4.28L18.90 4.60L19.28 4.97L19.60 5.39L19.88 5.84L20.10 6.33L20.27 6.83L20.37 7.36L20.40 7.91L20.34 8.46Z" />
      <path d="M8.6 9.2 10.4 12 8.6 14.8" />
      <path d="M12.8 14.6h3" />
    </svg>
  )
}

// Brand-coloured logos for the Tech Stack tab and social links.
const map = {
  react: [SiReact, '#61DAFB'],
  js: [SiJavascript, '#F7DF1E'],
  ts: [SiTypescript, '#3178C6'],
  html: [SiHtml5, '#E34F26'],
  css: [SiCss, '#1572B6'],
  tailwind: [SiTailwindcss, '#38BDF8'],
  php: [SiPhp, '#8892BF'],
  laravel: [SiLaravel, '#FF2D20'],
  mysql: [SiMysql, '#4479A1'],
  vite: [SiVite, '#A78BFA'],
  git: [SiGit, '#F05032'],
  github: [SiGithub, '#ffffff'],
  postman: [SiPostman, '#FF6C37'],
  figma: [SiFigma, '#F24E1E'],
  next: [SiNextdotjs, '#ffffff'],
  instagram: [SiInstagram, '#E4405F'],
  youtube: [SiYoutube, '#FF0000'],
  tiktok: [SiTiktok, '#ffffff'],
  linkedin: [Linkedin, '#0A66C2'],
  node: [SiNodedotjs, '#5FA04E'],
  express: [SiExpress, '#ffffff'],
  supabase: [SiSupabase, '#3FCF8E'],
  vercel: [SiVercel, '#ffffff'],
  railway: [SiRailway, '#ffffff'],
  netlify: [SiNetlify, '#00C7B7'],
  claude: [SiClaude, '#D97757'],
  codex: [CodexIcon, '#ffffff'],
  facebook: [SiFacebook, '#1877F2'],
  telegram: [SiTelegram, '#26A5E4'],
  email: [Mail, '#ff2a45'],
}

export default function TechIcon({ name, className, mono = false }) {
  const [Icon, color] = map[name] || map.react
  return <Icon className={className} color={mono ? 'currentColor' : color} />
}
