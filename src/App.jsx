import { useEffect, useRef, useState } from 'react'
import Intro from './components/Intro.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Portfolio from './components/Portfolio.jsx'
import ProjectDetail from './components/ProjectDetail.jsx'
import Journey from './components/Journey.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Admin from './components/Admin.jsx'
import { projects } from './data.js'

// Tiny path router: "/project/<slug>" opens a project page, "/admin" the inbox,
// "/<section>" scrolls the home page to that section. Cloudflare Pages serves
// index.html for every unknown path, so these URLs also work on reload.
const parse = () => {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === '/admin') return { page: 'admin' }
  const m = path.match(/^\/project\/([\w-]+)$/)
  if (m) return { page: 'project', slug: m[1] }
  return { page: 'home', section: path.slice(1) }
}

// Old links used "#portfolio" or "#/project/x": turn them into clean paths.
const legacy = window.location.hash.replace(/^#\/?/, '')
if (legacy) window.history.replaceState(null, '', legacy === 'home' ? '/' : `/${legacy}`)

function useRoute() {
  const [route, setRoute] = useState(() => ({ ...parse(), n: 0 }))
  useEffect(() => {
    const go = () => setRoute((r) => ({ ...parse(), n: r.n + 1 }))
    // intercept clicks on internal links ("/portfolio", "/project/x") so the
    // page doesn't reload
    const click = (e) => {
      const a = e.target.closest('a[href^="/"]')
      if (!a || a.target || a.hasAttribute('download') || e.defaultPrevented) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const href = a.getAttribute('href')
      if (/^\/(api|assets|projects|certificates)\//.test(href) || /\.\w+$/.test(href)) return
      e.preventDefault()
      if (href !== window.location.pathname) window.history.pushState(null, '', href)
      go()
    }
    document.addEventListener('click', click)
    window.addEventListener('popstate', go)
    return () => {
      document.removeEventListener('click', click)
      window.removeEventListener('popstate', go)
    }
  }, [])
  return route
}

export default function App() {
  const route = useRoute()
  const [introDone, setIntroDone] = useState(false)

  // red spotlight follows the cursor
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // scroll to the section named in the path (smoothly when already on the home page)
  const prevPage = useRef(route.page)
  useEffect(() => {
    const samePage = prevPage.current === route.page
    prevPage.current = route.page
    if (route.page !== 'home' || !route.section) {
      window.scrollTo({ top: 0, behavior: samePage && route.n ? 'smooth' : 'auto' })
      return
    }
    requestAnimationFrame(() =>
      document.getElementById(route.section)?.scrollIntoView({ behavior: samePage ? 'smooth' : 'auto' })
    )
  }, [route])

  const project = route.page === 'project' && projects.find((p) => p.slug === route.slug)

  return (
    <>
      <div className="bg" aria-hidden="true" />
      {!introDone && route.page !== 'admin' && <Intro onDone={() => setIntroDone(true)} />}
      {route.page === 'admin' ? (
        <Admin />
      ) : project ? (
        <ProjectDetail project={project} />
      ) : (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Portfolio />
            <Journey />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
