import {
  SiReact, SiJavascript, SiTypescript, SiHtml5, SiCss, SiTailwindcss, SiPhp, SiLaravel, SiMysql,
  SiVite, SiGit, SiGithub, SiPostman, SiFigma, SiInstagram, SiYoutube, SiTiktok, SiNextdotjs,
  SiNodedotjs, SiExpress, SiSupabase, SiVercel, SiRailway, SiNetlify, SiClaude, SiFacebook, SiTelegram,
} from 'react-icons/si'
import { Linkedin, Mail } from 'lucide-react'

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
  facebook: [SiFacebook, '#1877F2'],
  telegram: [SiTelegram, '#26A5E4'],
  email: [Mail, '#ff2a45'],
}

export default function TechIcon({ name, className, mono = false }) {
  const [Icon, color] = map[name] || map.react
  return <Icon className={className} color={mono ? 'currentColor' : color} />
}
