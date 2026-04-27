'use client'

import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionSafe } from '@/hooks/useMotionSafe'

gsap.registerPlugin(ScrollTrigger)

function setProcessRailActive(index) {
  const rail = document.querySelector('[data-process-rail]')
  if (!rail) return
  rail.querySelectorAll('li[data-process-step]').forEach((el) => {
    const step = Number(el.getAttribute('data-process-step'))
    if (step === index) el.setAttribute('data-active', 'true')
    else el.removeAttribute('data-active')
  })
}

export function HomeScrollOrchestrator() {
  const { prefersReduced } = useMotionSafe()

  useLayoutEffect(() => {
    if (prefersReduced) return undefined

    const ctx = gsap.context(() => {
      const hero = document.querySelector('#hero')
      if (hero) {
        const field = hero.querySelector('[data-hero-field]')
        if (field) {
          gsap.fromTo(
            field,
            { y: 0 },
            {
              y: 28,
              ease: 'none',
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          )
        }

        const title = hero.querySelector('[data-hero-title]')
        const deck = hero.querySelector('[data-hero-deck]')
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        if (title) tl.from(title, { opacity: 0, y: 12, duration: 0.55 }, 0.06)
        if (deck) tl.from(deck, { opacity: 0, y: 8, duration: 0.45 }, 0.18)
      }

      const systemsRoot = document.querySelector('[data-systems-root]')
      if (systemsRoot) {
        const busInner = systemsRoot.querySelector('[data-bus-line-inner]')
        if (busInner) {
          gsap.from(busInner, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: systemsRoot.querySelector('[data-systems-bus]') ?? systemsRoot,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          })
        }

        const cards = systemsRoot.querySelectorAll('[data-systems-card]')
        cards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 12,
            duration: 0.48,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            delay: Math.min(i * 0.09, 0.36),
          })
        })
      }

      const phases = document.querySelectorAll('[data-process-phase]')
      phases.forEach((phaseEl) => {
        const i = Number(phaseEl.getAttribute('data-process-phase'))
        if (Number.isNaN(i)) return
        ScrollTrigger.create({
          trigger: phaseEl,
          start: 'top 52%',
          end: 'bottom 48%',
          onEnter: () => setProcessRailActive(i),
          onEnterBack: () => setProcessRailActive(i),
        })
      })

      document.querySelectorAll('[data-work-item]').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 14,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          delay: Math.min(i * 0.06, 0.24),
        })
      })

      const encaje = document.querySelector('[data-encaje-divider]')
      const line = encaje?.querySelector('.encaje-divider-line')
      if (encaje && line && encaje.offsetParent !== null) {
        gsap.from(line, {
          scaleY: 0,
          transformOrigin: 'center center',
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: encaje,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        })
      }

      const cta = document.querySelector('[data-cta-content]')
      if (cta) {
        gsap.from(cta, {
          opacity: 0,
          y: 10,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    const refresh = () => ScrollTrigger.refresh()
    requestAnimationFrame(refresh)
    const t = window.setTimeout(refresh, 400)

    return () => {
      window.clearTimeout(t)
      ctx.revert()
    }
  }, [prefersReduced])

  return null
}
