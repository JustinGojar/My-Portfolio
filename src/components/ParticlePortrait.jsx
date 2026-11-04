import { useEffect, useRef } from 'react'

// Renders the profile photo as a 3D point cloud: points gather into the
// portrait, sway/rotate toward the cursor, scatter away from it, and get
// occasional "splash" streaks. HUD trackers label a few points with their
// live 3D coordinates.
const SAMPLE = 230 // sampling grid resolution (points ≈ visible pixels of a SAMPLE² image)
const TRACKERS = [
  [0.02, -0.78], // hair
  [-0.42, -0.22], // ear
  [-0.62, 0.62], // left shoulder
  [0.12, 0.42], // collar
  [0.5, 0.6], // right shoulder
]

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
    let trackers = []
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
      trackers = TRACKERS.map(([tx, ty]) => {
        let best = null, bd = Infinity
        for (const p of list) {
          const dd = (p.x - tx) ** 2 + (p.y - ty) ** 2
          if (dd < bd) { bd = dd; best = p }
        }
        return best
      }).filter(Boolean)
    }

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
      return [W / 2 + x1 * scale * persp, H / 2 - scale * 0.05 + y1 * scale * persp, z2]
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
        const [sx, sy2] = project(p, cy, sy, cp, sp, scale, now)
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

      // HUD trackers
      ctx.save()
      ctx.font = `${8 * dpr}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.lineWidth = dpr * 0.7
      const pos = trackers.map((p) => [...project(p, cy, sy, cp, sp, scale, now), p])
      ctx.strokeStyle = 'rgba(255,255,255,0.28)'
      ctx.beginPath()
      pos.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
      pos.forEach(([x, y], i) => {
        const b = 7 * dpr
        ctx.strokeStyle = i === 0 ? 'rgba(255,42,69,0.9)' : 'rgba(255,255,255,0.75)'
        ctx.beginPath()
        // corner brackets
        ctx.moveTo(x - b, y - b + 3 * dpr); ctx.lineTo(x - b, y - b); ctx.lineTo(x - b + 3 * dpr, y - b)
        ctx.moveTo(x + b - 3 * dpr, y + b); ctx.lineTo(x + b, y + b); ctx.lineTo(x + b, y + b - 3 * dpr)
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.fillRect(x - dpr, y - dpr, 2 * dpr, 2 * dpr)
        const p = pos[i][3]
        const f = (v) => (v >= 0 ? '+' : '') + v.toFixed(2)
        const label = `${f(p.x + p.ox)} ${f(-(p.y + p.oy))} ${f(p.z + p.oz)}`
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        const tw = ctx.measureText(label).width
        // labels point away from the face; skip one that doesn't fit on that side
        // (on small screens it would otherwise cover the face)
        const left = x < W / 2
        const lx = left ? x - b - 4 * dpr - tw : x + b + 4 * dpr
        if (lx < 0 || lx + tw > W) return
        ctx.shadowColor = 'rgba(0,0,0,0.9)'
        ctx.shadowBlur = 4 * dpr
        ctx.fillText(label, lx, y - b + 2 * dpr)
        ctx.shadowBlur = 0
      })
      ctx.restore()
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
