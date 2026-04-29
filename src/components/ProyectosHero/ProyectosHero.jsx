'use client'

import { useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroSystemField } from '@/components/HeroSystemField/HeroSystemField'
import { useMotionSafe } from '@/hooks/useMotionSafe'
import { SHOWCASE_SLIDE_COUNT } from '@/content/showcaseProjects'
import {
  SESSION_RESTORE_HERO_END,
  UNITS_PER_VH,
  PER_SHOWCASE_SLIDE,
  SHOWCASE_WIPE_DURATION,
  SHOWCASE_CLIP_VISIBLE,
  SHOWCASE_CLIP_HIDDEN_RIGHT,
  SHOWCASE_CARD_OFFSET_X,
  projectsPhaseDuration,
} from '@/content/heroShowcaseTimeline'
import { HomeFrameShowcase } from '@/components/HomeFrameShowcase/HomeFrameShowcase'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const HERO_FRAME_VISIBLE_EVENT = 'home-hero-frame-visible-change'

const DEEP_SCROLL_PROGRESS = 0.05
const BACK_TO_HOME_PROGRESS = 0.025

export function ProyectosHero() {
  const router = useRouter()
  const sectionRef = useRef(null)
  const hasDeepScrolledRef = useRef(false)
  const routedHomeRef = useRef(false)
  const { prefersReduced } = useMotionSafe()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const dispatchFrameVisible = (visible) => {
      window.dispatchEvent(
        new CustomEvent(HERO_FRAME_VISIBLE_EVENT, {
          detail: { visible: Boolean(visible) },
        })
      )
    }

    const showcaseRoot = section.querySelector('[data-hero-showcase]')
    const showcaseLegend = section.querySelector('[data-showcase-legend]')
    const frameTop = section.querySelector('[data-hero-frame-top]')
    const frameBottom = section.querySelector('[data-hero-frame-bottom]')
    const frameLeft = section.querySelector('[data-hero-frame-left]')
    const frameRight = section.querySelector('[data-hero-frame-right]')

    const TIMELINE_UNITS = projectsPhaseDuration
    const LOCAL_PHASE_START = 0

    section.__showcaseTiming = {
      projectsPhaseStart: LOCAL_PHASE_START,
      perSlide: PER_SHOWCASE_SLIDE,
      wipeDuration: SHOWCASE_WIPE_DURATION,
      timelineUnits: TIMELINE_UNITS,
    }

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        if (frameTop) gsap.set(frameTop, { height: '86px' })
        if (frameBottom) gsap.set(frameBottom, { height: '86px' })
        if (frameLeft) gsap.set(frameLeft, { width: '5vw' })
        if (frameRight) gsap.set(frameRight, { width: '5vw' })
        if (showcaseRoot) {
          gsap.set(showcaseRoot, {
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
          })
        }
        if (showcaseLegend) showcaseLegend.textContent = `1/${SHOWCASE_SLIDE_COUNT}`
        for (let i = 0; i < SHOWCASE_SLIDE_COUNT; i++) {
          const slide = section.querySelector(`[data-showcase-slide="${i}"]`)
          if (slide) {
            gsap.set(slide, {
              opacity: 1,
              zIndex: i + 1,
              xPercent: 0,
              clipPath: i === 0 ? SHOWCASE_CLIP_VISIBLE : SHOWCASE_CLIP_HIDDEN_RIGHT,
            })
          }
        }
        dispatchFrameVisible(true)
        return
      }

      if (frameTop) gsap.set(frameTop, { height: '86px' })
      if (frameBottom) gsap.set(frameBottom, { height: '86px' })
      if (frameLeft) gsap.set(frameLeft, { width: '5vw' })
      if (frameRight) gsap.set(frameRight, { width: '5vw' })
      if (showcaseRoot) {
        gsap.set(showcaseRoot, {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        })
      }
      for (let i = 0; i < SHOWCASE_SLIDE_COUNT; i++) {
        const slide = section.querySelector(`[data-showcase-slide="${i}"]`)
        if (slide) {
          gsap.set(slide, {
            opacity: 1,
            zIndex: i + 1,
            xPercent: SHOWCASE_CARD_OFFSET_X,
            clipPath: SHOWCASE_CLIP_HIDDEN_RIGHT,
          })
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () =>
            `+=${section.offsetHeight * (TIMELINE_UNITS / UNITS_PER_VH)}`,
          pin: true,
          pinType: 'fixed',
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            dispatchFrameVisible(self.isActive)
            if (self.progress > DEEP_SCROLL_PROGRESS) {
              hasDeepScrolledRef.current = true
            }
            if (
              !routedHomeRef.current &&
              hasDeepScrolledRef.current &&
              self.progress <= BACK_TO_HOME_PROGRESS
            ) {
              routedHomeRef.current = true
              sessionStorage.setItem(SESSION_RESTORE_HERO_END, '1')
              router.push('/')
            }
          },
          onLeave: () => dispatchFrameVisible(false),
          onLeaveBack: () => dispatchFrameVisible(false),
          onEnterBack: (self) => {
            dispatchFrameVisible(self.isActive)
          },
        },
      })

      if (showcaseRoot) {
        tl.to(
          showcaseRoot,
          {
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
            duration: 0.05,
            ease: 'none',
          },
          LOCAL_PHASE_START
        )
      }

      const projectsChapter = { progress: 0 }
      tl.to(
        projectsChapter,
        {
          progress: 1,
          duration: projectsPhaseDuration,
          ease: 'none',
          onUpdate: () => {
            if (!showcaseLegend) return
            const idx = Math.min(
              SHOWCASE_SLIDE_COUNT - 1,
              Math.floor(projectsChapter.progress * SHOWCASE_SLIDE_COUNT)
            )
            showcaseLegend.textContent = `${idx + 1}/${SHOWCASE_SLIDE_COUNT}`
          },
        },
        LOCAL_PHASE_START
      )

      for (let i = 0; i < SHOWCASE_SLIDE_COUNT; i++) {
        const slide = section.querySelector(`[data-showcase-slide="${i}"]`)
        if (!slide) continue
        const wipeStart =
          i === 0
            ? LOCAL_PHASE_START
            : LOCAL_PHASE_START + i * PER_SHOWCASE_SLIDE - SHOWCASE_WIPE_DURATION
        tl.fromTo(
          slide,
          {
            xPercent: SHOWCASE_CARD_OFFSET_X,
            clipPath: SHOWCASE_CLIP_HIDDEN_RIGHT,
          },
          {
            xPercent: 0,
            clipPath: SHOWCASE_CLIP_VISIBLE,
            duration: SHOWCASE_WIPE_DURATION,
            ease: 'none',
            immediateRender: false,
          },
          wipeStart
        )
      }
    }, section)

    return () => {
      if (section) delete section.__showcaseTiming
      dispatchFrameVisible(false)
      ctx.revert()
    }
  }, [prefersReduced, router])

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100lvh] flex-col overflow-hidden border-b border-border bg-background"
      aria-label="Proyectos"
      data-hero-section
      data-proyectos-section
    >
      <HeroSystemField className="opacity-[0.95]" data-hero-system-field />
      <div
        data-hero-steel-field
        className="pointer-events-none absolute inset-0 -z-10 field-radial-steel will-change-[opacity]"
        aria-hidden
      />
      <div
        data-hero-noise
        className="noise-hero pointer-events-none absolute inset-0 -z-10 opacity-85"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
        data-hero-frame
      >
        <div
          data-hero-frame-top
          className="absolute top-0 right-0 left-0 bg-white will-change-[height]"
          style={{ height: '86px' }}
        />
        <div
          data-hero-frame-bottom
          className="absolute right-0 bottom-0 left-0 bg-white will-change-[height]"
          style={{ height: '86px' }}
        />
        <div
          data-hero-frame-left
          className="absolute top-0 bottom-0 left-0 h-full bg-white will-change-[width]"
          style={{ width: '5vw' }}
        />
        <div
          data-hero-frame-right
          className="absolute top-0 right-0 bottom-0 h-full bg-white will-change-[width]"
          style={{ width: '5vw' }}
        />
      </div>

      <HomeFrameShowcase />
    </section>
  )
}
