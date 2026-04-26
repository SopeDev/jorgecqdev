'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { ENFOQUE_CONTENT } from '@/content/siteNarrative'
import { useMotionSafe } from '@/hooks/useMotionSafe'

gsap.registerPlugin(ScrollTrigger)

export function HomeFocus() {
  const sectionRef = useRef(null)
  const { prefersReduced } = useMotionSafe()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const lines = section.querySelectorAll('[data-focus-line-inner]')

      if (prefersReduced) {
        gsap.set(lines, { yPercent: 0, clipPath: 'inset(0 0 0 0)' })
        return
      }

      gsap.fromTo(
        lines,
        { yPercent: 108, clipPath: 'inset(100% 0 0 0)' },
        {
          yPercent: 0,
          clipPath: 'inset(0 0 0 0)',
          duration: 0.9,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'top 30%',
            scrub: 0.55,
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <SectionWrapper
      id="enfoque"
      variant="surface"
      borderTop
      depth
      aria-labelledby="enfoque-heading"
      className="relative overflow-hidden"
    >
      <section ref={sectionRef} className="relative">
        <div className="noise-ambient pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-14 h-px bg-line-diagram/80"
          aria-hidden
        />

        <p className="font-mono text-[length:var(--text-label)] font-medium uppercase tracking-[0.14em] text-muted-foreground md:text-[length:var(--text-label-md)]">
          {ENFOQUE_CONTENT.eyebrow}
        </p>
        <h2
          id="enfoque-heading"
          className="mt-4 max-w-3xl text-[clamp(1.7rem,2.8vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-foreground"
        >
          {ENFOQUE_CONTENT.title}
        </h2>

        <div className="mt-10 max-w-4xl space-y-5 text-[clamp(1.03rem,1.15vw,1.34rem)] leading-[1.7] text-muted-foreground md:mt-12">
          {ENFOQUE_CONTENT.lines.map((line) => (
            <p key={line} className="overflow-hidden">
              <span data-focus-line-inner className="block text-pretty will-change-transform">
                {line}
              </span>
            </p>
          ))}
        </div>
      </section>
    </SectionWrapper>
  )
}
