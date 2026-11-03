import { useEffect, useRef, useState } from 'react'
import { profile } from '../data.js'

// Hanging ID card on a lanyard. Drag it away and the strap stretches; push it up
// and the strap goes slack and crumples. Let go and it swings and springs back.
const REST = 380 // resting strap length in px
const MAX_STRETCH = 220 // px the strap can stretch, approached with a rubber-band feel
const MAX_SLACK = 250 // px the card can be pushed up; the strap crumples to make up the length
const W = 30 // strap width
const rubber = (d) => (d <= 0 ? Math.max(-MAX_SLACK, d) : MAX_STRETCH * (1 - Math.exp(-d / MAX_STRETCH)))

// Wavy centre line for a slack strap: folds that fade out at both ends so the
// strap still meets the pivot and the clip straight.
const FOLDS = 7
const SAMPLES = 48
const waveX = (t, amp) =>
  amp * Math.sin(Math.PI * t) * (Math.sin(FOLDS * Math.PI * t) + 0.35 * Math.sin((FOLDS * 2 + 1) * Math.PI * t))
const pathLength = (h, amp) => {
  let len = 0
  let px = 0
  let py = 0
  for (let i = 1; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const x = waveX(t, amp)
    const y = t * h
    len += Math.hypot(x - px, y - py)
    px = x
    py = y
  }
  return len
}
function strapPath(h) {
  const cx = W / 2
  if (h >= REST - 0.5) return `M${cx} 0 L${cx} ${h}`
  // find the fold size that keeps the strap at its real length
  let lo = 0
  let hi = 140
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2
    if (pathLength(h, mid) < REST) lo = mid
    else hi = mid
  }
  let d = `M${cx} 0`
  for (let i = 1; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    d += ` L${(cx + waveX(t, lo)).toFixed(2)} ${(t * h).toFixed(2)}`
  }
  return d
}

export default function Lanyard() {
  const rigRef = useRef(null)
  const pivotRef = useRef(null)
  const strapRef = useRef(null)
  const s = useRef({ angle: 28, vel: 0, tilt: 0, len: 0, lenVel: 0, dragging: false, lastAngle: 0, lastT: 0 })
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    let raf
    let prev = performance.now()
    const step = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.032)
      prev = now
      const st = s.current
      if (!st.dragging) {
        const acc = -38 * st.angle - 2.6 * st.vel // spring + damping
        st.vel += acc * dt
        st.angle += st.vel * dt
        const lenAcc = -140 * st.len - 7 * st.lenVel // bouncy spring back to rest length
        st.lenVel += lenAcc * dt
        st.len = Math.max(-MAX_SLACK, st.len + st.lenVel * dt)
      }
      st.tilt += (Math.max(-35, Math.min(35, st.vel * 0.25)) - st.tilt) * 0.12
      if (rigRef.current) {
        rigRef.current.style.transform = `rotate(${st.angle}deg)`
        rigRef.current.querySelector('.id-card').style.transform = `perspective(700px) rotateY(${st.tilt}deg)`
      }
      if (strapRef.current) {
        const h = REST + st.len
        strapRef.current.style.height = `${h}px`
        const d = strapPath(h)
        strapRef.current.querySelectorAll('path').forEach((p) => p.setAttribute('d', d))
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const distFrom = (e) => {
    const p = pivotRef.current.getBoundingClientRect()
    return Math.hypot(e.clientX - p.left, e.clientY - p.top)
  }

  const angleFrom = (e) => {
    const p = pivotRef.current.getBoundingClientRect()
    const dx = e.clientX - p.left
    const dy = Math.max(40, e.clientY - p.top)
    return Math.max(-65, Math.min(65, (-Math.atan2(dx, dy) * 180) / Math.PI))
  }

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const st = s.current
    st.dragging = true
    st.lastAngle = angleFrom(e)
    st.grabOffset = st.angle - st.lastAngle
    st.grabDist = distFrom(e) - st.len
    st.lenVel = 0
    st.lastT = performance.now()
    setDragging(true)
  }
  const move = (e) => {
    const st = s.current
    if (!st.dragging) return
    const a = angleFrom(e) + st.grabOffset
    const now = performance.now()
    const dt = Math.max((now - st.lastT) / 1000, 0.001)
    st.vel = st.vel * 0.5 + ((a - st.angle) / dt) * 0.5
    st.angle = a
    const len = rubber(distFrom(e) - st.grabDist)
    st.lenVel = st.lenVel * 0.5 + ((len - st.len) / dt) * 0.5
    st.len = len
    st.lastT = now
  }
  const up = () => {
    s.current.dragging = false
    s.current.vel = Math.max(-600, Math.min(600, s.current.vel))
    s.current.lenVel = Math.max(-1500, Math.min(1500, s.current.lenVel))
    setDragging(false)
  }

  const strapText = profile.brand.toUpperCase()
  return (
    <div className="lanyard-wrap">
      <div
        ref={rigRef}
        className={`lanyard ${dragging ? 'dragging' : ''}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div ref={pivotRef} style={{ width: 0, height: 0 }} />
        <svg ref={strapRef} className="strap" width={W} height={REST} aria-hidden="true">
          <defs>
            <filter id="strap-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path className="strap-edge" d={strapPath(REST)} />
          <path id="strap-line" className="strap-body" d={strapPath(REST)} />
          <text className="strap-text" filter="url(#strap-glow)">
            {['14%', '62%'].map((o) => (
              <textPath key={o} href="#strap-line" startOffset={o}>{strapText}</textPath>
            ))}
          </text>
        </svg>
        <div className="clip" />
        <div className="clip-ring" />
        <div className="id-card">
          <div className="photo">
            <img src={profile.photo} alt={profile.name} draggable="false" />
          </div>
          <div className="meta">
            <div>
              <strong>{profile.name}</strong>
              <small>{profile.cardRole}</small>
            </div>
            <div className="chip" />
          </div>
        </div>
      </div>
      <div className="drag-hint">← drag me →</div>
    </div>
  )
}
