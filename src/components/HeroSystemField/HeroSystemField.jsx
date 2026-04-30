'use client'

import { useRef, useEffect } from 'react'
import { useMotionSafe } from '@/hooks/useMotionSafe'
import { cn } from '@/lib/utils'

/** Node count for each hero field canvas (background, focus, post-grid). */
export const HERO_FIELD_NODE_COUNT = 30

const LINE_ALPHA_MAX = 0.26
const NODE_ALPHA = 0.7
/** Soft outer halo: circle radius = NODE_RADIUS * this (avoids per-node `shadowBlur`, which is costly). */
const GLOW_OUTER_R_FR = 2.1
/** Peak white alpha in outer halo (scaled by `breathe`); scaled per-node by depth. */
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
const LINK_DISTANCE_FR = 0.34
const MOUSE_LERP = 0.08
const MOUSE_PARALLAX_X = 24
const MOUSE_PARALLAX_Y = 17
const LOCAL_REACT_RADIUS_FR = 0.42
const LOCAL_REACT_BOOST_X = 68
const LOCAL_REACT_BOOST_Y = 56
const FOCUS_TARGET_SELECTOR = '[data-node-focus-target]'
const FOCUS_PROGRESS_PROP = '__nodeFocusProgress'
/** 0–1: background grid nodes pushed radially off-canvas (hero sequence). */
const SCATTER_PROGRESS_PROP = '__nodeScatterProgress'
/** Push distance at progress 1 as a fraction of max(viewport w,h). */
const SCATTER_EXIT_FR = 1.08

function initNodes(w, h, nodeCount) {
  const pad = Math.min(w, h) * SPAWN_PAD_FR
  return Array.from({ length: nodeCount }, () => {
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

function getFocusTargetRect(wrap, target) {
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

/** `background`: scatter-driven; `focus`: focus-cluster + fade sibling; `postGrid`: reserved for hero tail (no scatter/focus). */
function NodeLayer({ layerMode = 'background', nodeCount = HERO_FIELD_NODE_COUNT }) {
  const canvasRef = useRef(null)
  const { prefersReduced } = useMotionSafe()
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const stateRef = useRef(null)
  const lastTRef = useRef(0)
  const lastPaintRef = useRef(0)
  const inViewRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = canvas?.parentElement
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let focusTargetEl = null

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

      if (!focusTargetEl) {
        focusTargetEl = document.querySelector(FOCUS_TARGET_SELECTOR)
      }

      const prev = stateRef.current
      if (!prev) {
        stateRef.current = {
          nodes: initNodes(w, h, nodeCount),
          w,
          h,
          rx: new Float32Array(nodeCount),
          ry: new Float32Array(nodeCount),
          linkBuckets: null,
        }
      } else {
        const sx = w / prev.w
        const sy = h / prev.h
        for (const n of prev.nodes) {
          n.x *= sx
          n.y *= sy
        }
        prev.w = w
        prev.h = h
        if (prev.rx.length !== prev.nodes.length) {
          prev.rx = new Float32Array(prev.nodes.length)
          prev.ry = new Float32Array(prev.nodes.length)
        }
        prev.linkBuckets = null
        prev.linkBKey = undefined
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
      if (!st.rx || st.rx.length !== st.nodes.length) {
        st.rx = new Float32Array(st.nodes.length)
        st.ry = new Float32Array(st.nodes.length)
        st.linkBuckets = null
        st.linkBKey = undefined
      }
      const { nodes, w, h } = st
      const mr = mouseRef.current
      const focusProgress =
        layerMode === 'focus' ? clamp01(wrap[FOCUS_PROGRESS_PROP] || 0) : 0
      const scatterProgress =
        layerMode === 'background'
          ? clamp01(wrap[SCATTER_PROGRESS_PROP] || 0)
          : 0
      if (focusProgress > 0 && !focusTargetEl) {
        focusTargetEl = document.querySelector(FOCUS_TARGET_SELECTOR)
      }
      const focusRect =
        focusProgress > 0
          ? getFocusTargetRect(wrap, focusTargetEl)
          : null
      mr.x += (mr.tx - mr.x) * MOUSE_LERP
      mr.y += (mr.ty - mr.y) * MOUSE_LERP

      const parallaxX = mr.x * MOUSE_PARALLAX_X
      const parallaxY = mr.y * MOUSE_PARALLAX_Y
      const mouseX = (mr.x + 0.5) * w
      const mouseY = (mr.y + 0.5) * h
      const localRadius = Math.min(w, h) * LOCAL_REACT_RADIUS_FR

      const t = timeMs * 0.001
      const maxD = Math.min(w, h) * LINK_DISTANCE_FR
      const maxD2 = maxD * maxD
      const cellSize = maxD * 0.5
      const ncx = Math.max(1, Math.ceil(w / cellSize) + 1)
      const ncy = Math.max(1, Math.ceil(h / cellSize) + 1)
      const nCells = ncx * ncy
      const bKey = Math.round(w * 10) * 1e5 + Math.round(h * 10)
      if (st.linkBKey !== bKey) {
        st.linkBuckets = Array.from({ length: nCells }, () => [])
        st.linkNCells = nCells
        st.linkBKey = bKey
      } else {
        for (let b = 0; b < st.linkNCells; b++) st.linkBuckets[b].length = 0
      }

      const rx = st.rx
      const ry = st.ry
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const dx = n.x - mouseX
        const dy = n.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / localRadius)
        const falloff = influence * influence
        let x = n.x + parallaxX + mr.x * LOCAL_REACT_BOOST_X * falloff
        let y = n.y + parallaxY + mr.y * LOCAL_REACT_BOOST_Y * falloff

        if (focusRect) {
          const targetX = focusRect.x + focusRect.w * n.focusX
          const targetY = focusRect.y + focusRect.h * n.focusY
          const focusEase = focusProgress
          x += (targetX - x) * focusEase
          y += (targetY - y) * focusEase
        }

        if (scatterProgress > 0) {
          const cx = w * 0.5
          const cy = h * 0.5
          let nx = x - cx
          let ny = y - cy
          let len = Math.hypot(nx, ny)
          if (len < 1e-4) {
            nx = Math.cos(n.phase * 9.17)
            ny = Math.sin(n.phase * 9.17)
            len = 1
          }
          const push = scatterProgress * Math.max(w, h) * SCATTER_EXIT_FR
          x += (nx / len) * push
          y += (ny / len) * push
        }

        rx[i] = x
        ry[i] = y
        const ci = Math.min(
          ncx - 1,
          Math.max(0, (x / cellSize) | 0)
        )
        const cj = Math.min(
          ncy - 1,
          Math.max(0, (y / cellSize) | 0)
        )
        st.linkBuckets[cj * ncx + ci].push(i)
      }

      ctx.clearRect(0, 0, w, h)

      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const arx = rx[i]
        const ary = ry[i]
        const ci = Math.min(
          ncx - 1,
          Math.max(0, (arx / cellSize) | 0)
        )
        const cj = Math.min(
          ncy - 1,
          Math.max(0, (ary / cellSize) | 0)
        )
        for (let ocx = -2; ocx <= 2; ocx++) {
          for (let ocy = -2; ocy <= 2; ocy++) {
            const nci = ci + ocx
            const ncj = cj + ocy
            if (nci < 0 || ncj < 0 || nci >= ncx || ncj >= ncy) continue
            const list = st.linkBuckets[ncj * ncx + nci]
            for (let k = 0; k < list.length; k++) {
              const j = list[k]
              if (j <= i) continue
              const b = nodes[j]
              const brx = rx[j]
              const bry = ry[j]
              const d2 = dist2(arx, ary, brx, bry)
              if (d2 >= maxD2) continue
              const d = Math.sqrt(d2)
              const nudge =
                0.5 +
                0.5 * Math.sin(t * 0.55 + a.phase * 0.3 + b.phase * 0.7)
              const flicker = 0.78 + 0.22 * nudge * a.pulse * b.pulse
              const linkFall = 1 - d / maxD
              const linkDepth =
                Math.sqrt(
                  (DEPTH_LINK_MIN_FR + (1 - DEPTH_LINK_MIN_FR) * a.depth) *
                    (DEPTH_LINK_MIN_FR + (1 - DEPTH_LINK_MIN_FR) * b.depth)
                )
              const alpha =
                LINE_ALPHA_MAX * linkFall * linkFall * flicker * linkDepth
              ctx.strokeStyle = `rgba(255,255,255,${alpha})`
              ctx.beginPath()
              ctx.moveTo(arx, ary)
              ctx.lineTo(brx, bry)
              ctx.stroke()
            }
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const nx = rx[i]
        const ny = ry[i]
        const breathe = 0.88 + 0.12 * Math.sin(t * 0.9 + n.phase)
        const intensity =
          DEPTH_INTENSITY_MIN_FR + (1 - DEPTH_INTENSITY_MIN_FR) * n.depth
        const radius =
          NODE_RADIUS *
          (DEPTH_RADIUS_MIN_FR + (1 - DEPTH_RADIUS_MIN_FR) * n.depth)
        const depthBlur = 0.5 + 0.5 * n.depth
        const outerR = radius * (GLOW_OUTER_R_FR * 0.85 + 0.15 * depthBlur)
        ctx.fillStyle = '#fff'
        ctx.globalAlpha = NODE_GLOW_ALPHA * breathe * intensity
        ctx.beginPath()
        ctx.arc(nx, ny, outerR, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = NODE_ALPHA * breathe * intensity
        ctx.beginPath()
        ctx.arc(nx, ny, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
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
  }, [layerMode, nodeCount, prefersReduced])

  return (
    <canvas
      ref={canvasRef}
      data-hero-focus-node-layer={layerMode === 'focus' ? '' : undefined}
      data-hero-post-grid-field={layerMode === 'postGrid' ? '' : undefined}
      className={cn(
        'absolute inset-0 h-full w-full [contain:paint]',
        layerMode === 'background' && 'z-0 opacity-[0.6]',
        layerMode === 'focus' && 'z-[1] opacity-[0.6] will-change-[opacity,filter]',
        layerMode === 'postGrid' && 'z-[2] opacity-0'
      )}
    />
  )
}

export function HeroSystemField({ className, ...props }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 [contain:paint]',
        className
      )}
      {...props}
      aria-hidden
    >
      <NodeLayer layerMode="background" nodeCount={HERO_FIELD_NODE_COUNT} />
      <NodeLayer layerMode="focus" nodeCount={HERO_FIELD_NODE_COUNT} />
      <NodeLayer layerMode="postGrid" nodeCount={HERO_FIELD_NODE_COUNT} />
    </div>
  )
}
