'use client'

import { useRef, useEffect } from 'react'
import { useMotionSafe } from '@/hooks/useMotionSafe'
import { cn } from '@/lib/utils'

const NODE_COUNT = 65
const LINE_ALPHA_MAX = 0.26
const NODE_ALPHA = 0.7
/** Canvas shadowBlur for node halos (px); scaled per-node by depth. */
const GLOW_BLUR = 26
/** Peak white alpha in shadowColor (scaled by `breathe`); scaled per-node by depth. */
const NODE_GLOW_ALPHA = 0.42
/** Base dot radius (px); depth scales between DEPTH_RADIUS_MIN_FR and 1. */
const NODE_RADIUS = 1.65
const DEPTH_RADIUS_MIN_FR = 0.52
/** Fill / glow alpha multiplier at depth 0 vs1 (adds layering). */
const DEPTH_INTENSITY_MIN_FR = 0.32
/** Link alpha scales by geometric mean of endpoint depths (so far–far links fade). */
const DEPTH_LINK_MIN_FR = 0.12
/** Initial spawn inset (fraction of min side) — smaller = closer to edges. */
const SPAWN_PAD_FR = 0.02
/** Bounce margin so nodes / glow can reach near the rim without clipping. */
const BOUNCE_MARGIN_FR = 0.014
const TARGET_FPS = 30
const FRAME_TIME = 1000 / TARGET_FPS
const MOUSE_LERP = 0.08
const MOUSE_PARALLAX_X = 24
const MOUSE_PARALLAX_Y = 17
const LOCAL_REACT_RADIUS_FR = 0.42
const LOCAL_REACT_BOOST_X = 68
const LOCAL_REACT_BOOST_Y = 56
const FOCUS_ATTR = 'data-node-focus-progress'
const FOCUS_TARGET_SELECTOR = '[data-node-focus-target]'
const FOCUS_SPREAD_X = 38
const FOCUS_SPREAD_Y = 18

function initNodes(w, h) {
  const pad = Math.min(w, h) * SPAWN_PAD_FR
  return Array.from({ length: NODE_COUNT }, () => {
    /** 0 = back, 1 = front — drives size, brightness, and link weight. */
    const depth = Math.pow(Math.random(), 0.85)
    return {
      x: pad + Math.random() * (w - 2 * pad),
      y: pad + Math.random() * (h - 2 * pad),
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18,
      phase: Math.random() * Math.PI * 2,
      pulse: 0.65 + Math.random() * 0.35,
      depth,
      focusX: Math.random(),
      focusY: Math.random(),
      focusOffsetX: (Math.random() - 0.5) * FOCUS_SPREAD_X,
      focusOffsetY: (Math.random() - 0.5) * FOCUS_SPREAD_Y,
    }
  })
}

function dist2(ax, ay, bx, by) {
  const dx = ax - bx
  const dy = ay - by
  return dx * dx + dy * dy
}

function clamp01(value) {
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

function getFocusTargetRect(wrap) {
  const target = document.querySelector(FOCUS_TARGET_SELECTOR)
  if (!target) return null

  const wrapRect = wrap.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  return {
    x: targetRect.left - wrapRect.left,
    y: targetRect.top - wrapRect.top,
    w: targetRect.width,
    h: targetRect.height,
  }
}

/**
 * Low-contrast node–link field: drift, soft link breathing, mouse parallax.
 */
export function HeroSystemField({ className, ...props }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const { prefersReduced } = useMotionSafe()
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const stateRef = useRef(null)
  const lastTRef = useRef(0)
  const lastPaintRef = useRef(0)
  const inViewRef = useRef(true)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const onMove = (e) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 1
      mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 1
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = wrap.getBoundingClientRect()
      const w = Math.max(32, r.width)
      const h = Math.max(32, r.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const prev = stateRef.current
      if (!prev) {
        stateRef.current = { nodes: initNodes(w, h), w, h }
      } else {
        const sx = w / prev.w
        const sy = h / prev.h
        for (const n of prev.nodes) {
          n.x *= sx
          n.y *= sy
        }
        prev.w = w
        prev.h = h
      }
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(wrap)
    resize()

    window.addEventListener('mousemove', onMove, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.01 }
    )
    io.observe(wrap)

    const drawFrame = (timeMs) => {
      const st = stateRef.current
      if (!st) return
      const { nodes, w, h } = st
      const mr = mouseRef.current
      const focusProgress = clamp01(Number(wrap.getAttribute(FOCUS_ATTR)) || 0)
      const focusRect = focusProgress > 0 ? getFocusTargetRect(wrap) : null
      mr.x += (mr.tx - mr.x) * MOUSE_LERP
      mr.y += (mr.ty - mr.y) * MOUSE_LERP

      const parallaxX = mr.x * MOUSE_PARALLAX_X
      const parallaxY = mr.y * MOUSE_PARALLAX_Y
      const mouseX = (mr.x + 0.5) * w
      const mouseY = (mr.y + 0.5) * h
      const localRadius = Math.min(w, h) * LOCAL_REACT_RADIUS_FR

      const t = timeMs * 0.001
      const maxD = Math.min(w, h) * 0.25
      const maxD2 = maxD * maxD

      const rendered = nodes.map((n) => {
        const dx = n.x - mouseX
        const dy = n.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / localRadius)
        const falloff = influence * influence
        let x = n.x + parallaxX + mr.x * LOCAL_REACT_BOOST_X * falloff
        let y = n.y + parallaxY + mr.y * LOCAL_REACT_BOOST_Y * falloff

        if (focusRect) {
          const targetX =
            focusRect.x +
            focusRect.w * n.focusX +
            n.focusOffsetX * (0.35 + n.depth * 0.65)
          const targetY =
            focusRect.y +
            focusRect.h * (0.22 + n.focusY * 0.58) +
            n.focusOffsetY * (0.35 + n.depth * 0.65)
          const focusEase = 1 - Math.pow(1 - focusProgress, 3)
          x += (targetX - x) * focusEase
          y += (targetY - y) * focusEase
        }

        return {
          x,
          y,
        }
      })

      ctx.clearRect(0, 0, w, h)

      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const ar = rendered[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const br = rendered[j]
          const d2 = dist2(ar.x, ar.y, br.x, br.y)
          if (d2 >= maxD2) continue
          const d = Math.sqrt(d2)
          const nudge = 0.5 + 0.5 * Math.sin(t * 0.55 + a.phase * 0.3 + b.phase * 0.7)
                   const flicker = 0.78 + 0.22 * nudge * a.pulse * b.pulse
          const falloff = 1 - d / maxD
          const linkDepth =
            Math.sqrt(
              (DEPTH_LINK_MIN_FR + (1 - DEPTH_LINK_MIN_FR) * a.depth) *
                (DEPTH_LINK_MIN_FR + (1 - DEPTH_LINK_MIN_FR) * b.depth)
            )
          const alpha =
            LINE_ALPHA_MAX * falloff * falloff * flicker * linkDepth
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`
          ctx.beginPath()
          ctx.moveTo(ar.x, ar.y)
          ctx.lineTo(br.x, br.y)
          ctx.stroke()
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const nr = rendered[i]
        const breathe = 0.88 + 0.12 * Math.sin(t * 0.9 + n.phase)
        const intensity =
          DEPTH_INTENSITY_MIN_FR + (1 - DEPTH_INTENSITY_MIN_FR) * n.depth
        const radius =
          NODE_RADIUS *
          (DEPTH_RADIUS_MIN_FR + (1 - DEPTH_RADIUS_MIN_FR) * n.depth)
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowColor = `rgba(255,255,255,${NODE_GLOW_ALPHA * breathe * intensity})`
        ctx.shadowBlur = GLOW_BLUR * (0.5 + 0.5 * n.depth)
        ctx.fillStyle = `rgba(255,255,255,${NODE_ALPHA * breathe * intensity})`
        ctx.beginPath()
        ctx.arc(nr.x, nr.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      if (!prefersReduced) {
        const last = lastTRef.current || timeMs
        const dt = Math.min(48, timeMs - last) / 1000
        lastTRef.current = timeMs
        for (const n of nodes) {
          n.x += n.vx * dt
          n.y += n.vy * dt
          const m = Math.min(w, h) * BOUNCE_MARGIN_FR
          if (n.x < m) {
            n.x = m
            n.vx *= -1
          } else if (n.x > w - m) {
            n.x = w - m
            n.vx *= -1
          }
          if (n.y < m) {
            n.y = m
            n.vy *= -1
          } else if (n.y > h - m) {
            n.y = h - m
            n.vy *= -1
          }
        }
      }
    }

    const staticDraw = () => {
      drawFrame(performance.now())
    }

    if (prefersReduced) {
      staticDraw()
      return () => {
        ro.disconnect()
        window.removeEventListener('mousemove', onMove)
      }
    }

    let rafId = 0
    const loop = (now) => {
      if (inViewRef.current && now - lastPaintRef.current >= FRAME_TIME) {
        drawFrame(now)
        lastPaintRef.current = now
      }
      rafId = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(rafId)
        rafId = 0
      } else if (rafId === 0) {
        rafId = requestAnimationFrame(loop)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [prefersReduced])

  return (
    <div
      ref={wrapRef}
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
      {...props}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-[0.6]"
      />
    </div>
  )
}
