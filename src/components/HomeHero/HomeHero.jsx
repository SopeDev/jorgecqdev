'use client'

import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MinimalButton } from '@/components/MinimalButton/MinimalButton'
import { HeroSystemField } from '@/components/HeroSystemField/HeroSystemField'
import { useMotionSafe } from '@/hooks/useMotionSafe'
import { ENFOQUE_CONTENT } from '@/content/siteNarrative'
import { HomeProjectCardsGrid } from '@/components/HomeProjectCardsGrid/HomeProjectCardsGrid'

gsap.registerPlugin(ScrollTrigger)

export function HomeHero() {
  const copyRef = useRef(null)
  const sectionRef = useRef(null)
  const { prefersReduced } = useMotionSafe()

  useLayoutEffect(() => {
    let introRaf = 0
    let introCheckRaf = 0
    let bodyScrollLocked = false
    let introSettled = false
    let onLateScrollCheck = () => {}
    let lateCheckTimeout = 0
    const section = sectionRef.current
    const copy = copyRef.current
    if (!section || !copy) return

    const applyScrollLock = () => {
      if (bodyScrollLocked) return
      bodyScrollLocked = true
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    }

    const releaseScrollLock = () => {
      if (!bodyScrollLocked) return
      bodyScrollLocked = false
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      ScrollTrigger.refresh()
    }

    const ctx = gsap.context(() => {
      const titleLines = copy.querySelectorAll('[data-hero-title-line]')
      const paragraph = copy.querySelector('[data-hero-paragraph]')
      const actions = copy.querySelector('[data-hero-actions]')
      const steelField = section.querySelector('[data-hero-steel-field]')
      const enfoqueSteelField = section.querySelector('[data-enfoque-steel-field]')
      const systemField = section.querySelector('[data-hero-system-field]')
      const focusNodeLayer = section.querySelector('[data-hero-focus-node-layer]')
      const scrollIndicator = section.querySelector('[data-hero-scroll-indicator]')
      const scrollIndicatorLine = section.querySelector('[data-hero-scroll-line]')
      const focusBlock = section.querySelector('[data-focus-block]')
      const focusHeading = section.querySelector('[data-focus-heading-line]')
      const focusTitleParts = section.querySelectorAll('[data-focus-title-part]')
      const focusLines = section.querySelectorAll('[data-focus-line]')
      const focusClipRevealEls = [...focusTitleParts].filter(Boolean)
      const titleInDelay = 0.12
      const titleInDuration = 1.2
      const titleInStagger = 0.3
      const paragraphInDelay =
        titleInDelay + titleInDuration + titleInStagger * Math.max(0, titleLines.length - 1) + 0.08
      const indicatorInDelay = paragraphInDelay + 0.7
      /**
       * Timeline units: 4 per 100lvh of pin scroll. Example: 1 unit = 25lvh.
       */
      const UNITS_PER_VH = 4
      /** Narrow screens: halve scrub speed by doubling scroll distance per timeline progress. */
      const mobileScrollSlowFactor = () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 767px)').matches
          ? 2
          : 1
      const SEG_HERO = 4
      const SEG_ENF = 4
      const T_ENFO = SEG_HERO
      const T_BODY = SEG_HERO + SEG_ENF
      const heroOutStart = 0.1
      const heroOutDuration = T_ENFO - heroOutStart
      const heroOutSecondLineDuration = T_ENFO - heroOutStart
      const heroOutStagger = 0
      const focusHeadingStart = T_ENFO
      const focusHeadingDuration = 4
      const focusNodesFadeStart = focusHeadingStart + focusHeadingDuration * 0.5
      const focusNodesFadeDuration = focusHeadingDuration * 0.58
      const focusTitleStart = T_BODY
      const focusTitleDuration = 1.2
      const focusTitleStagger = 0.8
      const focusLinesStart = 10
      const focusLinesDuration = 2
      const enfoqueSteelInDuration =
        focusLinesStart + focusLinesDuration - focusTitleStart
      /** Start scatter after Enfoque copy finishes. */
      const paragraphRevealEnd = focusLinesStart + focusLinesDuration
      const scatterPhaseStart = paragraphRevealEnd
      const scatterPhaseDuration = 6
      const enfoqueFadeOutStart = 13
      const enfoqueFadeOutDuration = 2
      /** Former frame window: tiles fade/scale in while scatter finishes (15 → 18). */
      const cardsPhaseStart = 15
      const cardsPhaseDuration = 3
      const TIMELINE_UNITS = scatterPhaseStart + scatterPhaseDuration
      const focusNodes = { progress: 0 }
      const nodeScatter = { progress: 0 }

      let lastFocusAttr = '0'
      const setNodeFocusProgress = (value) => {
        if (!systemField) return
        systemField.__nodeFocusProgress = value
      }

      const setNodeScatterProgress = (value) => {
        if (!systemField) return
        systemField.__nodeScatterProgress = value
      }

      if (prefersReduced) {
        gsap.set(titleLines, { yPercent: 0 })
        gsap.set(paragraph, { opacity: 1 })
        gsap.set(actions, { opacity: 1 })
        gsap.set(focusBlock, { opacity: 1 })
        gsap.set(focusHeading, { opacity: 1, filter: 'blur(0px)' })
        gsap.set(focusClipRevealEls, { yPercent: 0 })
        gsap.set(focusLines, { opacity: 1 })
        if (enfoqueSteelField) gsap.set(enfoqueSteelField, { opacity: 1 })
        setNodeFocusProgress(1)
        lastFocusAttr = '1'
        gsap.set(focusNodeLayer, { opacity: 0, filter: 'blur(14px)' })
        gsap.set(scrollIndicator, { opacity: 1 })
        gsap.set(scrollIndicatorLine, { scaleY: 1 })
        const projectCards = section.querySelectorAll('[data-project-card]')
        gsap.set(projectCards, { opacity: 1, scale: 1 })
        return
      }

      if (enfoqueSteelField) gsap.set(enfoqueSteelField, { opacity: 0 })
      gsap.set(focusHeading, { opacity: 0, filter: 'blur(50px)' })
      gsap.set(focusClipRevealEls, { yPercent: 112 })
      gsap.set(focusLines, { opacity: 0, yPercent: 0 })
      setNodeFocusProgress(0)
      setNodeScatterProgress(0)
      gsap.set(focusNodeLayer, { opacity: 1, filter: 'blur(0px)' })
      const projectCards = section.querySelectorAll('[data-project-card]')
      gsap.set(projectCards, {
        opacity: 0,
        scale: 0.88,
        transformOrigin: '50% 58%',
      })

      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () =>
            `+=${section.offsetHeight * (TIMELINE_UNITS / UNITS_PER_VH) * mobileScrollSlowFactor()}`,
          pin: true,
          pinType: 'fixed',
          pinSpacing: true,
          /** Small scrub smoothing keeps scroll-linked motion from feeling mechanically 1:1. */
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false,
        },
      })

      heroScrollTl
        .to(
          titleLines[0],
          {
            yPercent: -112,
            duration: heroOutDuration,
            force3D: true,
            ease: 'none',
          },
          heroOutStart
        )
        .to(
          titleLines[1],
          {
            yPercent: -112,
            duration: heroOutSecondLineDuration,
            force3D: true,
            ease: 'none',
          },
          heroOutStart + heroOutStagger
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
          actions,
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
            duration: 0.15,
          },
          T_ENFO
        )
        .to(
          focusHeading,
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: focusHeadingDuration,
            ease: 'none',
          },
          focusHeadingStart
        )
        .to(
          focusNodes,
          {
            progress: 1,
            duration: focusHeadingDuration,
            ease: 'none',
            onUpdate: () => {
              const v = focusNodes.progress.toFixed(2)
              if (v === lastFocusAttr) return
              lastFocusAttr = v
              setNodeFocusProgress(Number(v))
            },
          },
          focusHeadingStart
        )
        .to(
          focusNodeLayer,
          {
            opacity: 0,
            filter: 'blur(14px)',
            duration: focusNodesFadeDuration,
            ease: 'none',
          },
          focusNodesFadeStart
        )
        .to(
          focusTitleParts,
          {
            yPercent: 0,
            duration: focusTitleDuration,
            force3D: true,
            stagger: focusTitleStagger,
            ease: 'none',
          },
          focusTitleStart
        )

      if (enfoqueSteelField) {
        heroScrollTl.to(
          enfoqueSteelField,
          {
            opacity: 1,
            duration: enfoqueSteelInDuration,
            ease: 'power2.out',
          },
          focusTitleStart
        )
      }

      heroScrollTl
        .to(
          focusLines,
          {
            opacity: 1,
            duration: focusLinesDuration,
            ease: 'power2.out',
          },
          focusLinesStart
        )
        .to(
          nodeScatter,
          {
            progress: 1,
            duration: scatterPhaseDuration,
            /** ease-in: edge nodes need little distance to exit; linear progress reads “done” too early. */
            ease: 'power2.in',
            onUpdate: () => {
              setNodeScatterProgress(nodeScatter.progress)
            },
          },
          scatterPhaseStart
        )
        .to(
          focusBlock,
          {
            opacity: 0,
            duration: enfoqueFadeOutDuration,
            ease: 'none',
          },
          enfoqueFadeOutStart
        )

      if (enfoqueSteelField) {
        heroScrollTl.to(
          enfoqueSteelField,
          {
            opacity: 0,
            duration: enfoqueFadeOutDuration,
            ease: 'none',
          },
          enfoqueFadeOutStart
        )
      }

      if (projectCards.length) {
        heroScrollTl.to(
          projectCards,
          {
            opacity: 1,
            scale: 1,
            duration: cardsPhaseDuration,
            ease: 'power3.out',
            stagger: {
              amount: Math.min(2.45, cardsPhaseDuration * 0.82),
              from: 'random',
            },
          },
          cardsPhaseStart
        )
      }

      const atPageTop = () => window.scrollY <= 2

      const setIntroToFinishedState = () => {
        gsap.set(titleLines, { yPercent: 0 })
        gsap.set(paragraph, { opacity: 1 })
        gsap.set(actions, { opacity: 1 })
        gsap.set(scrollIndicator, { opacity: 1 })
        gsap.set(scrollIndicatorLine, { scaleY: 1, transformOrigin: 'top center' })
      }

      const introTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          introSettled = true
          releaseScrollLock()
        },
      })

      const bypassIntro = () => {
        if (introSettled) return
        introSettled = true
        releaseScrollLock()
        introTl.progress(1).kill()
        setIntroToFinishedState()
        ScrollTrigger.refresh()
      }

      if (atPageTop()) {
        gsap.set(titleLines, { yPercent: 112 })
        gsap.set(paragraph, { opacity: 0 })
        gsap.set(actions, { opacity: 0 })
        gsap.set(scrollIndicator, { opacity: 0 })
        gsap.set(scrollIndicatorLine, { scaleY: 0.2, transformOrigin: 'top center' })
      } else {
        setIntroToFinishedState()
        ScrollTrigger.refresh()
      }

      introTl
        .to(titleLines, {
          yPercent: 0,
          duration: titleInDuration,
          stagger: titleInStagger,
          ease: 'power3.out',
          delay: titleInDelay,
        })
        .to(
          paragraph,
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
          },
          paragraphInDelay
        )
        .to(
          actions,
          {
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          paragraphInDelay + 0.12
        )
        .to(
          scrollIndicator,
          {
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          indicatorInDelay
        )
        .to(
          scrollIndicatorLine,
          {
            scaleY: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          indicatorInDelay
        )

      onLateScrollCheck = () => {
        if (!atPageTop()) {
          bypassIntro()
        }
      }
      window.addEventListener('load', onLateScrollCheck, { once: true })
      requestAnimationFrame(() => {
        lateCheckTimeout = window.setTimeout(onLateScrollCheck, 0)
      })

      introRaf = window.requestAnimationFrame(() => {
        introCheckRaf = window.requestAnimationFrame(() => {
          if (!atPageTop()) {
            bypassIntro()
            return
          }
          if (introSettled) {
            return
          }

          applyScrollLock()
          introTl.play(0)
        })
      })
    }, section)

    return () => {
      window.removeEventListener('load', onLateScrollCheck)
      window.clearTimeout(lateCheckTimeout)
      window.cancelAnimationFrame(introRaf)
      window.cancelAnimationFrame(introCheckRaf)
      releaseScrollLock()
      ctx.revert()
    }
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden border-b border-border bg-background"
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
        data-enfoque-steel-field
        className="pointer-events-none absolute inset-0 -z-[9] scale-x-[-1] field-radial-steel will-change-[opacity]"
        aria-hidden
      />
      <div
        data-hero-noise
        className="noise-hero pointer-events-none absolute inset-0 -z-10 opacity-85"
        aria-hidden
      />

      <HomeProjectCardsGrid />

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
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center">
        <div
          data-focus-block
          className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 opacity-0 md:grid-cols-12 md:items-start md:gap-10"
          aria-label="Mi enfoque"
        >
          <div className="md:col-span-5">
            <div className="inline-block w-fit">
              <h1
                data-node-focus-target
                className="text-[clamp(2.2rem,4.2vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground"
              >
                <span
                  data-focus-heading-line
                  className="block pb-[0.08em] will-change-[opacity,filter] md:whitespace-nowrap"
                >
                  {ENFOQUE_CONTENT.sectionLabel}
                </span>
              </h1>
            </div>
          </div>

          <div className="pt-[15px] md:col-span-7">
            <h2 className="max-w-2xl text-[clamp(1.12rem,1.62vw,1.72rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground">
              <span className="inline-block overflow-hidden py-[0.08em]">
                <span
                  data-focus-title-part
                  className="inline-block pb-[0.08em] will-change-transform"
                >
                  {ENFOQUE_CONTENT.titleLead.trim()}
                </span>
              </span>
              {' '}
              <span className="inline-block overflow-hidden py-[0.08em]">
                <span
                  data-focus-title-part
                  className="inline-block pb-[0.08em] will-change-transform"
                >
                  <span className="text-primary">{ENFOQUE_CONTENT.titleAccent}</span>
                  {'.'}
                </span>
              </span>
            </h2>
            <div className="mt-8 max-w-2xl text-[clamp(1.02rem,1.1vw,1.24rem)] leading-[1.65] text-muted-foreground md:mt-10">
              <p>
                <span data-focus-line className="block text-pretty will-change-opacity">
                  {ENFOQUE_CONTENT.lines.map((line, index) => (
                    <Fragment key={line}>
                      {index > 0 ? (
                        <>
                          <br />
                          <br />
                        </>
                      ) : null}
                      {line}
                    </Fragment>
                  ))}
                </span>
              </p>
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
