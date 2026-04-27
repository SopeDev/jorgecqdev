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
      const leftHeading = section.querySelector('[data-focus-left-heading]')
      const rightTitle = section.querySelector('[data-focus-right-title]')
      const lines = section.querySelectorAll('[data-focus-line-inner]')
      const revealEls = [leftHeading, rightTitle, ...lines].filter(Boolean)

      if (prefersReduced) {
        gsap.set(revealEls, { yPercent: 0 })
        return
      }

      gsap.set(revealEls, { yPercent: 112 })

      const scrollTrigger = {
        trigger: section,
        start: 'top 72%',
        end: 'top 30%',
        scrub: 0.55,
      }

      /**
       * Same line treatment as the hero h1: overflow-hidden + yPercent 112 → 0
       * (see HomeHero title lines, data-hero-title-line).
       */
      const lineEase = 'power3.out'
      const lineFrom = { yPercent: 112 }
      const lineDur = 0.55

      gsap
        .timeline({ scrollTrigger })
        .fromTo(
          leftHeading,
          lineFrom,
          { yPercent: 0, duration: lineDur, ease: lineEase }
        )
        .fromTo(
          rightTitle,
          lineFrom,
          { yPercent: 0, duration: 0.48, ease: lineEase },
          '>'
        )
        .fromTo(
          lines,
          lineFrom,
          {
            yPercent: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: lineEase,
          },
          '>'
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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
          <div className="lg:col-span-5">
            <h2
              id="enfoque-heading"
              className="text-[clamp(1.85rem,3.1vw,2.85rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground"
            >
              <span className="block overflow-hidden py-[0.08em]">
                <span
                  data-focus-left-heading
                  className="block pb-[0.08em] will-change-transform"
                >
                  {ENFOQUE_CONTENT.sectionLabel}
                </span>
              </span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <h3
              className="max-w-3xl text-[clamp(1.2rem,1.85vw,1.7rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground"
            >
              <span className="block overflow-hidden py-[0.08em]">
                <span
                  data-focus-right-title
                  className="block pb-[0.08em] will-change-transform"
                >
                  {ENFOQUE_CONTENT.title}
                </span>
              </span>
            </h3>

            <div className="mt-8 max-w-4xl space-y-5 text-[clamp(1.03rem,1.15vw,1.34rem)] leading-[1.7] text-muted-foreground md:mt-9">
              {ENFOQUE_CONTENT.lines.map((line) => (
                <p key={line} className="overflow-hidden">
                  <span
                    data-focus-line-inner
                    className="block text-pretty will-change-transform"
                  >
                    {line}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  )
}
