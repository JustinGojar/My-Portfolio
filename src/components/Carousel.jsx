import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Coverflow-style image slider: the active slide sits in front, neighbours peek
// out smaller and dimmer on each side. Autoplays, pauses on hover, and supports
// arrows, dots, keyboard and swipe.
export default function Carousel({ images, title }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const drag = useRef(null)
  const n = images.length

  const go = (d) => setIndex((i) => (i + d + n) % n)

  useEffect(() => {
    if (n < 2 || paused) return
    const t = setInterval(() => go(1), 5000)
    return () => clearInterval(t)
  }, [n, paused, index])

  if (n === 1) {
    return <div className="preview"><img src={images[0].src} alt={images[0].alt || title} /></div>
  }

  // shortest signed distance from the active slide, so the loop wraps both ways
  const offsetOf = (k) => {
    let d = k - index
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  const onDown = (e) => { drag.current = e.clientX }
  const onUp = (e) => {
    if (drag.current == null) return
    const dx = e.clientX - drag.current
    drag.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        if (e.key === 'ArrowRight') go(1)
      }}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => { drag.current = null }}
    >
      <div className="carousel-stage">
        {images.map((img, k) => {
          const off = offsetOf(k)
          const abs = Math.abs(off)
          return (
            <button
              type="button"
              key={img.src}
              className={`slide ${off === 0 ? 'active' : ''}`}
              style={{
                transform: `translateX(calc(-50% + ${off * 46}%)) scale(${1 - Math.min(abs, 2) * 0.16})`,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1,
                pointerEvents: abs > 1 ? 'none' : 'auto',
              }}
              onClick={() => off !== 0 && go(off)}
              aria-label={off === 0 ? img.alt : `Show slide ${k + 1}`}
              aria-hidden={abs > 1}
              tabIndex={-1}
            >
              <img src={img.src} alt={img.alt || title} draggable="false" style={{ objectPosition: img.position || 'center' }} />
              {img.caption && <span className="slide-caption">{img.caption}</span>}
            </button>
          )
        })}
        <button type="button" className="carousel-arrow prev" onClick={() => go(-1)} aria-label="Previous slide">
          <ChevronLeft size={20} />
        </button>
        <button type="button" className="carousel-arrow next" onClick={() => go(1)} aria-label="Next slide">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="carousel-dots">
        {images.map((img, k) => (
          <button
            type="button"
            key={img.src}
            className={k === index ? 'on' : ''}
            onClick={() => setIndex(k)}
            aria-label={`Go to slide ${k + 1}`}
            aria-current={k === index}
          />
        ))}
      </div>
    </div>
  )
}
