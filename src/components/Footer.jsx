import { profile } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} {profile.name} <span>—</span> All rights reserved.
    </footer>
  )
}
