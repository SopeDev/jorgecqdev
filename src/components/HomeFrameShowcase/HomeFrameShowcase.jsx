'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  MinimalButton,
  minimalButtonVariants,
} from '@/components/MinimalButton/MinimalButton'
import { SHOWCASE_PROJECTS } from '@/content/showcaseProjects'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

export function HomeFrameShowcase() {
  const router = useRouter()
  const isTransitioningRef = useRef(false)

  const settleShowcaseSlide = async (section, slideIndex) => {
    const timing = section?.__showcaseTiming
    if (!timing || Number.isNaN(slideIndex)) return

    const trigger = ScrollTrigger.getAll().find((st) => st.trigger === section)
    if (!trigger) return

    const { projectsPhaseStart, perSlide, wipeDuration, timelineUnits } = timing
    const i = Math.max(0, Math.min(SHOWCASE_PROJECTS.length - 1, slideIndex))
    const wipeStart = i === 0
      ? projectsPhaseStart
      : projectsPhaseStart + i * perSlide - wipeDuration
    const fullVisibleStart = wipeStart + wipeDuration
    const nextWipeStart = i === SHOWCASE_PROJECTS.length - 1
      ? projectsPhaseStart + SHOWCASE_PROJECTS.length * perSlide
      : projectsPhaseStart + (i + 1) * perSlide - wipeDuration
    const targetUnit = fullVisibleStart + Math.max(0.32, (nextWipeStart - fullVisibleStart) * 0.5)
    const targetProgress = Math.max(0, Math.min(1, targetUnit / timelineUnits))
    const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress

    if (Math.abs(window.scrollY - targetScroll) < 8) return

    window.scrollTo({ top: targetScroll, behavior: 'smooth' })

    await new Promise((resolve) => {
      const startedAt = performance.now()
      const check = () => {
        const closeEnough = Math.abs(window.scrollY - targetScroll) < 10
        const timedOut = performance.now() - startedAt > 1000
        if (closeEnough || timedOut) {
          resolve()
          return
        }
        window.requestAnimationFrame(check)
      }
      window.requestAnimationFrame(check)
    })

    await new Promise((resolve) => window.setTimeout(resolve, 180))
  }

  const handleProjectEnter = async (event, project) => {
    event.preventDefault()
    if (isTransitioningRef.current) return

    const button = event.currentTarget
    const slide = button.closest('[data-showcase-slide]')
    const viewport = button.closest('[data-showcase-viewport]')
    const showcaseRoot = button.closest('[data-hero-showcase]')
    const section = button.closest('[data-hero-section]')
    const image = slide?.querySelector('img')
    if (!slide || !viewport || !showcaseRoot || !section || !image) {
      router.push(`/project/${project.slug}`)
      return
    }

    isTransitioningRef.current = true
    const slideIndex = Number(slide.getAttribute('data-showcase-slide'))
    await settleShowcaseSlide(section, slideIndex)

    const meta = slide.querySelector('[data-showcase-meta]')
    const actions = slide.querySelector('[data-showcase-actions]')
    const legend = showcaseRoot.querySelector('[data-showcase-legend]')
    const frameTop = section.querySelector('[data-hero-frame-top]')
    const frameBottom = section.querySelector('[data-hero-frame-bottom]')
    const frameLeft = section.querySelector('[data-hero-frame-left]')
    const frameRight = section.querySelector('[data-hero-frame-right]')

    const rect = viewport.getBoundingClientRect()
    gsap.set(viewport, {
      position: 'fixed',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: 'auto',
      bottom: 'auto',
      zIndex: 120,
      pointerEvents: 'none',
      margin: 0,
      willChange: 'top,left,width,height,transform,filter,border-width',
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        sessionStorage.setItem(
          'project-route-transition',
          JSON.stringify({
            slug: project.slug,
            at: Date.now(),
          })
        )
        router.push(`/project/${project.slug}`)
      },
      onInterrupt: () => {
        gsap.set(viewport, {
          clearProps:
            'position,top,left,width,height,right,bottom,zIndex,pointerEvents,margin,willChange',
        })
        isTransitioningRef.current = false
      },
    })

    tl.to(
      [meta, legend, actions],
      {
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power2.inOut',
      },
      0
    )
    tl.to(
      [frameTop, frameBottom],
      {
        height: 0,
        duration: 0.9,
      },
      0.34
    )

    tl.to(
      [frameLeft, frameRight],
      {
        width: 0,
        duration: 0.9,
      },
      0.34
    )

    tl.to(
      viewport,
      {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        duration: 1.14,
      },
      0.16
    )

  }

  return (
    <div
      data-hero-showcase
      className="pointer-events-none absolute inset-0 z-12 opacity-0 [visibility:hidden]"
      aria-hidden
    >
      <div
        data-showcase-viewport
        className="pointer-events-none absolute inset-x-[10vw] inset-y-[15lvh] overflow-hidden"
      >
        <p
          data-showcase-legend
          className="pointer-events-none absolute top-5 right-5 z-40 rounded-full bg-black/48 px-3 py-1.5 font-mono text-[0.8rem] tracking-[0.18em] text-white shadow-[0_1px_12px_rgba(0,0,0,0.45)] backdrop-blur-[3px] select-none"
        >
          1/5
        </p>

        <div className="relative z-30 h-full min-h-0 w-full">
          {SHOWCASE_PROJECTS.map((project, index) => (
            <div
              key={project.slug}
              data-showcase-slide={index}
              className="pointer-events-none absolute inset-0 opacity-0 will-change-[clip-path,transform]"
            >
              <div
                data-showcase-meta
                className="pointer-events-none absolute left-5 top-5 z-30 max-w-[min(92%,34rem)] text-left drop-shadow-[0_1px_14px_rgba(0,0,0,0.68)] select-none"
              >
                <p className="font-mono text-[0.62rem] font-medium tracking-[0.2em] text-white/78 uppercase">
                  {project.client}
                </p>
                <p className="mt-2 text-[clamp(1.15rem,2.8vw,2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                  {project.title}
                </p>
              </div>
              {/* Replace with local assets in public/ when ready */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />

              <div className="pointer-events-none absolute right-5 bottom-5 z-20 flex justify-end pl-5 md:right-6 md:bottom-6">
                <div data-showcase-actions className="pointer-events-auto flex flex-wrap justify-end gap-3">
                  <MinimalButton
                    onClick={(event) => handleProjectEnter(event, project)}
                    variant="solid"
                    size="lg"
                  >
                    Ver caso
                  </MinimalButton>
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      minimalButtonVariants({
                        variant: 'outline',
                        size: 'lg',
                      }),
                      'border-white/[0.22] bg-background/35 text-foreground shadow-sm backdrop-blur-[3px] hover:bg-card-hover/90'
                    )}
                  >
                    Visitar sitio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
