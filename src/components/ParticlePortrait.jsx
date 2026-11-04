import { useEffect, useRef } from 'react'

// Renders the profile photo as a 3D point cloud: points gather into the
// portrait, sway/rotate toward the cursor, scatter away from it, and get
// occasional "splash" streaks.
const SAMPLE = 330 // sampling grid resolution (points ≈ visible pixels of a SAMPLE² image)

export default function ParticlePortrait({ src, alt }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let running = false
    let disposed = false
    let pts = null
    let W = 0
    let H = 0
    let dpr = 1
    let img = null
    let buf = null
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -1e4, py: -1e4, inside: false }
    let splash = null
    let nextSplash = 2500
    let t0 = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      W = Math.max(1, Math.round(r.width * dpr))
      H = Math.max(1, Math.round(r.height * dpr))
      canvas.width = W
      canvas.height = H
      img = ctx.createImageData(W, H)
      buf = new Uint32Array(img.data.buffer)
      if (reduce && pts) draw(performance.now())
    }

    const build = (image) => {
      const off = document.createElement('canvas')
      off.width = off.height = SAMPLE
      const o = off.getContext('2d', { willReadFrequently: true })
      o.drawImage(image, 0, 0, SAMPLE, SAMPLE)
      const d = o.getImageData(0, 0, SAMPLE, SAMPLE).data
      const list = []
      for (let y = 0; y < SAMPLE; y++) {
        for (let x = 0; x < SAMPLE; x++) {
          const i = (y * SAMPLE + x) * 4
          if (d[i + 3] < 140) continue
          const r = d[i], g = d[i + 1], b = d[i + 2]
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          // jitter within the cell so the cloud doesn't look like a grid
          const nx = ((x + Math.random()) / SAMPLE) * 2 - 1
          const ny = ((y + Math.random()) / SAMPLE) * 2 - 1
          // body bulges toward the viewer; brighter areas (face, shirt) a little more
          const bulge = Math.sqrt(Math.max(0, 1 - nx * nx * 1.4 - Math.max(0, ny) * 0.2))
          const nz = bulge * 0.32 + lum * 0.12
          // lift dark tones slightly so the suit still reads on black
          const k = 1.15
          const cr = Math.min(255, r * k + 14), cg = Math.min(255, g * k + 10), cb = Math.min(255, b * k + 14)
          list.push({
            x: nx, y: ny, z: nz,
            // start scattered so the portrait "gathers" in
            ox: (Math.random() - 0.5) * 3, oy: (Math.random() - 0.5) * 3, oz: (Math.random() - 0.5) * 2,
            vx: 0, vy: 0,
            col: (255 << 24) | (cb << 16) | (cg << 8) | cr,
            seed: Math.random(),
          })
        }
      }
      if (reduce) for (const p of list) p.ox = p.oy = p.oz = 0
      pts = list
    }

    const out = [0, 0]
    const project = (p, cy, sy, cp, sp, scale, now) => {
      let x = p.x + p.ox, y = p.y + p.oy, z = p.z + p.oz
      if (splash && Math.abs(y - splash.y) < splash.h) {
        const f = 1 - Math.abs(y - splash.y) / splash.h
        x += splash.amp * f * (0.4 + p.seed) * splash.k
      }
      // subtle breathing shimmer
      z += Math.sin(now * 0.002 + p.seed * 12) * 0.008
      const x1 = x * cy + z * sy
      const z1 = -x * sy + z * cy
      const y1 = y * cp - z1 * sp
      const z2 = y * sp + z1 * cp
      const persp = 2.6 / (2.6 - z2)
      out[0] = W / 2 + x1 * scale * persp
      out[1] = H / 2 - scale * 0.05 + y1 * scale * persp
      return out
    }

    const draw = (now) => {
      const t = (now - t0) / 1000
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      const yaw = (reduce ? 0 : Math.sin(t * 0.45) * 0.28) + mouse.x * 0.55
      const pitch = mouse.y * 0.18
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
      const scale = Math.min(W, H) * 0.4

      if (!reduce) {
        if (now > nextSplash && !splash) {
          splash = { y: Math.random() * 1.4 - 0.6, h: 0.08 + Math.random() * 0.18, amp: 0.25 + Math.random() * 0.45, k: 0, start: now }
          nextSplash = now + 3000 + Math.random() * 3500
        }
        if (splash) {
          const e = (now - splash.start) / 900
          splash.k = e < 0.25 ? e / 0.25 : Math.max(0, 1 - (e - 0.25) / 0.75)
          if (e >= 1) splash = null
        }
      }

      buf.fill(0)
      const rad = 70 * dpr
      const s = dpr >= 1.5 ? 2 : 1 // point size in device px
      for (const p of pts) {
        // spring back toward the portrait
        p.ox += (0 - p.ox) * 0.045 + p.vx
        p.oy += (0 - p.oy) * 0.045 + p.vy
        p.oz *= 0.955
        p.vx *= 0.86
        p.vy *= 0.86
        project(p, cy, sy, cp, sp, scale, now)
        const sx = out[0], sy2 = out[1]
        if (mouse.inside && !reduce) {
          const dx = sx - mouse.px, dy = sy2 - mouse.py
          const d2 = dx * dx + dy * dy
          if (d2 < rad * rad) {
            const f = (1 - Math.sqrt(d2) / rad) * 0.012
            p.vx += (dx / rad) * f + (Math.random() - 0.5) * 0.002
            p.vy += (dy / rad) * f
          }
        }
        const px = sx | 0, py = sy2 | 0
        if (px < 0 || py < 0 || px >= W - s || py >= H - s) continue
        const i = py * W + px
        buf[i] = p.col
        if (s === 2) { buf[i + 1] = p.col; buf[i + W] = p.col; buf[i + W + 1] = p.col }
      }
      ctx.putImageData(img, 0, 0)
    }

    const loop = (now) => {
      if (!running) return
      draw(now)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduce || !pts) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.px = (e.clientX - r.left) * dpr
      mouse.py = (e.clientY - r.top) * dpr
      mouse.inside = mouse.px >= 0 && mouse.py >= 0 && mouse.px <= W && mouse.py <= H
      mouse.tx = mouse.inside ? ((e.clientX - r.left) / r.width) * 2 - 1 : 0
      mouse.ty = mouse.inside ? ((e.clientY - r.top) / r.height) * 2 - 1 : 0
    }
    const onClick = () => {
      if (!pts || reduce) return
      for (const p of pts) { p.ox = (Math.random() - 0.5) * 1.6; p.oy = (Math.random() - 0.5) * 1.6; p.oz = (Math.random() - 0.5) }
    }

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (disposed) return
      build(image)
      resize()
      t0 = performance.now()
      if (reduce) draw(t0)
      else if (visible) start()
    }
    image.src = src

    let visible = false
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('click', onClick)

    return () => {
      disposed = true
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('click', onClick)
    }
  }, [src])

  return <canvas ref={canvasRef} className="particle-portrait" role="img" aria-label={alt} />
}
