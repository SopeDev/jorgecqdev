'use client'

import { useRef, useEffect, useId } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionSafe } from '@/hooks/useMotionSafe'

gsap.registerPlugin(ScrollTrigger)

/** Muy sutil: opacidad casi imperceptible, sin competir con el contenido. */
export function ScrollReveal({ children, className, as: Component = 'div' }) {
  const ref = useRef(null)
  const id = useId().replace(/:/g, '')
  const { prefersReduced } = useMotionSafe()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      el,
      { y: 8, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 70%',
          id: `reveal-${id}`,
        },
      }
    )

    return () => ScrollTrigger.getById(`reveal-${id}`)?.kill()
  }, [id, prefersReduced])

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  )
}
