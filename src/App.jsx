import { useEffect, useState } from 'react'
import Intro from './components/Intro.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Portfolio from './components/Portfolio.jsx'
import ProjectDetail from './components/ProjectDetail.jsx'
import Journey from './components/Journey.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { projects } from './data.js'

// Tiny hash router: "#/project/<slug>" opens a project page, anything else is the home page.
function useRoute() {
  const read = () => {
    const m = window.location.hash.match(/^#\/project\/([\w-]+)/)
    return m ? { page: 'project', slug: m[1] } : { page: 'home' }
  }
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
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

  // returning from a project page: jump back to the portfolio section
  useEffect(() => {
    if (route.page === 'home') {
      const id = window.location.hash.slice(1)
      if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
  }, [route.page])

  const project = route.page === 'project' && projects.find((p) => p.slug === route.slug)

  return (
    <>
      <div className="bg" aria-hidden="true" />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      {project ? (
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
