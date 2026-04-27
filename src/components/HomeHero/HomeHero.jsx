'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MinimalButton } from '@/components/MinimalButton/MinimalButton'
import { HeroSystemField } from '@/components/HeroSystemField/HeroSystemField'
import { useMotionSafe } from '@/hooks/useMotionSafe'
import { ENFOQUE_CONTENT } from '@/content/siteNarrative'

gsap.registerPlugin(ScrollTrigger)

export function HomeHero() {
  const copyRef = useRef(null)
  const sectionRef = useRef(null)
  const { prefersReduced } = useMotionSafe()

  useLayoutEffect(() => {
    const section = sectionRef.current
    const copy = copyRef.current
    if (!section || !copy) return

    const ctx = gsap.context(() => {
      const titleLines = copy.querySelectorAll('[data-hero-title-line]')
      const paragraph = copy.querySelector('[data-hero-paragraph]')
      const actions = copy.querySelector('[data-hero-actions]')
      const steelField = section.querySelector('[data-hero-steel-field]')
      const systemField = section.querySelector('[data-hero-system-field]')
      const scrollIndicator = section.querySelector('[data-hero-scroll-indicator]')
      const scrollIndicatorLine = section.querySelector('[data-hero-scroll-line]')
      const focusBlock = section.querySelector('[data-focus-block]')
      const focusHeading = section.querySelector('[data-focus-heading-line]')
      const focusTitle = section.querySelector('[data-focus-title-line]')
      const focusLines = section.querySelectorAll('[data-focus-line]')
      const focusRevealEls = [focusHeading, focusTitle, ...focusLines].filter(Boolean)
      const titleInDelay = 0.12
      const titleInDuration = 1.2
      const titleInStagger = 0.3
      const paragraphInDelay =
        titleInDelay + titleInDuration + titleInStagger * Math.max(0, titleLines.length - 1) + 0.08
      const indicatorInDelay = paragraphInDelay + 0.7
      const heroOutStart = 0.1
      const heroOutDuration = 0.5
      const heroOutStagger = 0.22
      const heroOutEnd =
        heroOutStart + heroOutDuration + heroOutStagger * Math.max(0, titleLines.length - 1)
      const focusInStart = heroOutEnd + 0.08
      const focusHeadingDuration = titleInDuration
      const focusTitleDuration = 0.55
      const focusNodes = { progress: 0 }
      const focusHeadingStart = focusInStart + 0.04
      const focusTitleStart = focusHeadingStart + focusHeadingDuration + 0.12
      const focusLinesStart = focusTitleStart + focusTitleDuration + 0.16

      if (prefersReduced) {
        gsap.set(titleLines, { yPercent: 0 })
        gsap.set(paragraph, { opacity: 1 })
        gsap.set(actions, { opacity: 1 })
        gsap.set(focusBlock, { opacity: 1 })
        gsap.set(focusRevealEls, { yPercent: 0 })
        systemField?.setAttribute('data-node-focus-progress', '1')
        gsap.set(scrollIndicator, { opacity: 1 })
        gsap.set(scrollIndicatorLine, { scaleY: 1 })
        return
      }

      gsap.set(focusRevealEls, { yPercent: 112 })
      systemField?.setAttribute('data-node-focus-progress', '0')

      gsap.fromTo(
        titleLines,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: titleInDuration,
          stagger: titleInStagger,
          ease: 'power3.out',
          delay: titleInDelay,
        }
      )
      if (paragraph) {
        gsap.fromTo(
          paragraph,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
            delay: paragraphInDelay,
          }
        )
      }
      if (scrollIndicator && scrollIndicatorLine) {
        gsap.fromTo(
          scrollIndicator,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
            delay: indicatorInDelay,
          }
        )
        gsap.fromTo(
          scrollIndicatorLine,
          { scaleY: 0.2, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: indicatorInDelay,
          }
        )
      }

      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=90%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      heroScrollTl
        .to(
          titleLines,
          {
            yPercent: -112,
            duration: heroOutDuration,
            stagger: heroOutStagger,
            ease: 'none',
          },
          heroOutStart
        )
        .to(
          paragraph,
          {
            opacity: 0,
            duration: heroOutDuration,
            ease: 'none',
          },
          heroOutStart
        )
        .to(
          steelField,
          {
            opacity: 0,
            duration: heroOutDuration,
            ease: 'none',
          },
          heroOutStart
        )
        .to(
          scrollIndicator,
          {
            opacity: 0,
            duration: heroOutDuration,
            ease: 'none',
          },
          heroOutStart
        )
        .to(
          focusBlock,
          {
            opacity: 1,
            ease: 'none',
          },
          focusInStart
        )
        .to(
          focusHeading,
          {
            yPercent: 0,
            duration: focusHeadingDuration,
            ease: 'power3.out',
          },
          focusHeadingStart
        )
        .to(
          focusNodes,
          {
            progress: 1,
            duration: focusHeadingDuration,
            ease: 'power3.out',
            onUpdate: () => {
              systemField?.setAttribute(
                'data-node-focus-progress',
                focusNodes.progress.toFixed(3)
              )
            },
          },
          focusHeadingStart
        )
        .to(
          focusTitle,
          {
            yPercent: 0,
            duration: focusTitleDuration,
            ease: 'power3.out',
          },
          focusTitleStart
        )
        .to(
          focusLines,
          {
            yPercent: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
          },
          focusLinesStart
        )
    }, section)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden border-b border-border"
      aria-labelledby="hero-heading"
      data-hero-section
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

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 md:py-12">
        <div ref={copyRef} className="relative z-[4] max-w-[72rem]">
            <h1
              id="hero-heading"
              className="text-[clamp(2.1rem,4.55vw,4rem)] font-semibold leading-[1.08] tracking-[-0.028em] text-foreground"
            >
              <span className="block overflow-hidden py-[0.08em]">
                <span
                  data-hero-title-line
                  className="block pb-[0.08em] will-change-transform md:whitespace-nowrap"
                >
                  Construyo sistemas que
                </span>
              </span>
              <span className="block overflow-hidden py-[0.08em]">
                <span
                  data-hero-title-line
                  className="block pb-[0.08em] will-change-transform md:whitespace-nowrap"
                >
                  <span className="text-primary">escalan</span>.
                </span>
              </span>
            </h1>

            <p
              data-hero-paragraph
              className="mt-8 max-w-[47rem] text-pretty text-[clamp(1rem,1.2vw,1.22rem)] font-normal leading-[1.75] text-muted-foreground"
            >
              Plataformas, ecommerce, dashboards y herramientas a medida - para negocios que
              quieren crecer, automatizar y construir a largo plazo.
            </p>

            <div
              data-hero-actions
              className="mt-11 flex w-full max-w-2xl flex-wrap items-center gap-3"
            >
              <MinimalButton href="#proyectos" variant="solid" size="lg">
                Ver proyectos
              </MinimalButton>
              <MinimalButton
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white/[0.2] bg-background/20 backdrop-blur-[2px] hover:bg-card-hover/85"
              >
                Hablemos de tu proyecto
              </MinimalButton>
            </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center px-6">
        <div
          data-focus-block
          className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 opacity-0 md:grid-cols-12 md:items-start md:gap-10"
          aria-label="Mi enfoque"
        >
          <div className="md:col-span-5">
            <h1
              data-node-focus-target
              className="text-[clamp(2.2rem,4.2vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground"
            >
              <span className="block overflow-hidden py-[0.08em]">
                <span
                  data-focus-heading-line
                  className="block pb-[0.08em] will-change-transform md:whitespace-nowrap"
                >
                  {ENFOQUE_CONTENT.sectionLabel}
                </span>
              </span>
            </h1>
          </div>

          <div className="md:col-span-7 md:text-right">
            <h2 className="ml-auto max-w-2xl text-[clamp(1.3rem,2.1vw,2.15rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground">
              <span className="block overflow-hidden py-[0.08em]">
                <span
                  data-focus-title-line
                  className="block pb-[0.08em] will-change-transform"
                >
                  {ENFOQUE_CONTENT.title}
                </span>
              </span>
            </h2>
            <div className="mt-8 ml-auto max-w-2xl space-y-4 text-[clamp(1.02rem,1.1vw,1.24rem)] leading-[1.65] text-muted-foreground md:mt-10">
              {ENFOQUE_CONTENT.lines.map((line) => (
                <p key={line} className="overflow-hidden">
                  <span data-focus-line className="block text-pretty will-change-transform">
                    {line}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        data-hero-scroll-indicator
        className="pointer-events-none absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 opacity-0 md:bottom-1"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-3">
          <p className="text-[0.72rem] font-medium tracking-[0.08em] text-foreground/80">Scroll</p>
          <span
            data-hero-scroll-line
            className="block h-12 w-px bg-foreground/65 md:h-14"
          />
        </div>
      </div>
    </section>
  )
}
