'use client'

import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MinimalButton } from '@/components/MinimalButton/MinimalButton'
import { HeroSystemField } from '@/components/HeroSystemField/HeroSystemField'
import { useMotionSafe } from '@/hooks/useMotionSafe'
import { ENFOQUE_CONTENT } from '@/content/siteNarrative'
import { SHOWCASE_SLIDE_COUNT } from '@/content/showcaseProjects'
import { HomeFrameShowcase } from '@/components/HomeFrameShowcase/HomeFrameShowcase'

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
      const frameTop = section.querySelector('[data-hero-frame-top]')
      const frameBottom = section.querySelector('[data-hero-frame-bottom]')
      const frameLeft = section.querySelector('[data-hero-frame-left]')
      const frameRight = section.querySelector('[data-hero-frame-right]')
      const showcaseRoot = section.querySelector('[data-hero-showcase]')
      const showcaseLegend = section.querySelector('[data-showcase-legend]')
      const focusClipRevealEls = [...focusTitleParts].filter(Boolean)
      const titleInDelay = 0.12
      const titleInDuration = 1.2
      const titleInStagger = 0.3
      const paragraphInDelay =
        titleInDelay + titleInDuration + titleInStagger * Math.max(0, titleLines.length - 1) + 0.08
      const indicatorInDelay = paragraphInDelay + 0.7
      /**
       * Timeline units: 4 per 1vh of pin scroll. Phases: hero out, enfoque label +
       * canvas, h2 + paragraphs (no dead gap), then 1vh background nodes scatter.
       */
      const UNITS_PER_VH = 4
      const SEG_HERO = 3.6
      const SEG_ENF = 3.6
      const T_ENFO = SEG_HERO
      const T_BODY = SEG_HERO + SEG_ENF
      const heroOutStart = 0.1
      const heroOutDuration = 2.4
      const heroOutSecondLineDuration = 3
      const heroOutStagger = 0.5
      const focusHeadingStart = T_ENFO
      const focusHeadingDuration = 3
      const focusNodesFadeStart = focusHeadingStart + focusHeadingDuration * 0.5
      const focusNodesFadeDuration = focusHeadingDuration * 0.58
      const focusTitleStart = T_BODY
      const focusTitleDuration = 0.8
      const focusTitleStagger = 0.58
      const focusLinesStart = focusTitleStart + focusTitleDuration + focusTitleStagger + 0.28
      const focusLinesDuration = 1.1
      const enfoqueSteelInDuration =
        focusLinesStart + focusLinesDuration - focusTitleStart
      /** Start scatter the frame Enfoque copy finishes (same as paragraph opacity end). */
      const paragraphRevealEnd = focusLinesStart + focusLinesDuration
      const scatterPhaseStart = paragraphRevealEnd
      const scatterPhaseDuration = UNITS_PER_VH
      /** Enfoque copy + steel: opacity 40% → 80% along scatter scrub. */
      const enfoqueFadeOutStart = scatterPhaseStart + scatterPhaseDuration * 0.4
      const enfoqueFadeOutDuration = scatterPhaseDuration * 0.4
      /** White edge frame: 60% → 100% of scatter (after Enfoque fade begins). */
      const framePhaseStart = scatterPhaseStart + scatterPhaseDuration * 0.6
      const framePhaseDuration = scatterPhaseDuration * 0.4
      /**
       * Showcase: scroll math is NOT “vh × UNITS_PER_VH” — that blew up slide length by 100×.
       * Actual pin mapping: pixels_scrubbed ≈ innerHeight × (timeline_units / UNITS_PER_VH).
       * So one slide spanning `PER_SHOWCASE_SLIDE` units needs innerHeight × (PER / UNITS_PER_VH) scroll.
       * Example: PER=400 (old bug) → 100× viewport height per slide. Use SMALL values (timeline units).
       */
      const projectsPhaseStart = scatterPhaseStart + scatterPhaseDuration
      /** ~half a viewport scroll per slide (PER=2 → scroll ratio 2/4 = 0.5). Tune 1–3 for snappier. */
      const PER_SHOWCASE_SLIDE = 2
      const SHOWCASE_CROSS = Math.min(PER_SHOWCASE_SLIDE * 0.15, 0.35)
      const projectsPhaseDuration = SHOWCASE_SLIDE_COUNT * PER_SHOWCASE_SLIDE
      const TIMELINE_UNITS = projectsPhaseStart + projectsPhaseDuration
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
        if (frameTop) gsap.set(frameTop, { height: 0 })
        if (frameBottom) gsap.set(frameBottom, { height: 0 })
        if (frameLeft) gsap.set(frameLeft, { width: 0 })
        if (frameRight) gsap.set(frameRight, { width: 0 })
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
          const actions = section.querySelector(`[data-showcase-actions="${i}"]`)
          if (slide) gsap.set(slide, { opacity: i === 0 ? 1 : 0 })
          if (actions) gsap.set(actions, { opacity: i === 0 ? 1 : 0 })
        }
        return
      }

      if (enfoqueSteelField) gsap.set(enfoqueSteelField, { opacity: 0 })
      gsap.set(focusHeading, { opacity: 0, filter: 'blur(50px)' })
      gsap.set(focusClipRevealEls, { yPercent: 112 })
      gsap.set(focusLines, { opacity: 0, yPercent: 0 })
      setNodeFocusProgress(0)
      setNodeScatterProgress(0)
      gsap.set(focusNodeLayer, { opacity: 1, filter: 'blur(0px)' })
      if (frameTop && frameBottom) {
        gsap.set(frameTop, { height: 0 })
        gsap.set(frameBottom, { height: 0 })
      }
      if (frameLeft && frameRight) {
        gsap.set(frameLeft, { width: 0 })
        gsap.set(frameRight, { width: 0 })
      }
      if (showcaseRoot) {
        gsap.set(showcaseRoot, {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        })
      }
      for (let i = 0; i < SHOWCASE_SLIDE_COUNT; i++) {
        const slide = section.querySelector(`[data-showcase-slide="${i}"]`)
        const actions = section.querySelector(`[data-showcase-actions="${i}"]`)
        if (slide) gsap.set(slide, { opacity: 0 })
        if (actions) gsap.set(actions, { opacity: 0 })
      }

      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () =>
            `+=${window.innerHeight * (TIMELINE_UNITS / UNITS_PER_VH)}`,
          pin: true,
          pinType: 'fixed',
          pinSpacing: true,
          /** `true` = scroll maps 1:1 to timeline (numeric scrub lags behind scroll). */
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: process.env.NODE_ENV === 'development',
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

      const frameGrowVars = [
        [frameTop, { height: '15vh' }],
        [frameBottom, { height: '15vh' }],
        [frameLeft, { width: '10vw' }],
        [frameRight, { width: '10vw' }],
      ]
      for (const [el, vars] of frameGrowVars) {
        if (!el) continue
        heroScrollTl.to(
          el,
          {
            ...vars,
            duration: framePhaseDuration,
            ease: 'none',
          },
          framePhaseStart
        )
      }

      if (showcaseRoot) {
        heroScrollTl.to(
          showcaseRoot,
          {
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
            duration: 0.05,
            ease: 'none',
          },
          projectsPhaseStart
        )
      }

      const projectsChapter = { progress: 0 }
      heroScrollTl.to(
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
        projectsPhaseStart
      )

      for (let i = 0; i < SHOWCASE_SLIDE_COUNT; i++) {
        const slide = section.querySelector(`[data-showcase-slide="${i}"]`)
        const actions = section.querySelector(`[data-showcase-actions="${i}"]`)
        if (!slide) continue
        const segEnd = projectsPhaseStart + (i + 1) * PER_SHOWCASE_SLIDE
        const fadeOutStart = segEnd - SHOWCASE_CROSS
        if (i === 0) {
          heroScrollTl.fromTo(
            slide,
            { opacity: 0 },
            { opacity: 1, duration: SHOWCASE_CROSS, ease: 'none' },
            projectsPhaseStart
          )
        } else {
          const fadeInStart = projectsPhaseStart + i * PER_SHOWCASE_SLIDE - SHOWCASE_CROSS
          heroScrollTl.fromTo(
            slide,
            { opacity: 0 },
            { opacity: 1, duration: SHOWCASE_CROSS, ease: 'none' },
            fadeInStart
          )
        }
        if (i < SHOWCASE_SLIDE_COUNT - 1) {
          heroScrollTl.to(
            slide,
            { opacity: 0, duration: SHOWCASE_CROSS, ease: 'none' },
            fadeOutStart
          )
        }
        if (actions) {
          if (i === 0) {
            heroScrollTl.fromTo(
              actions,
              { opacity: 0 },
              { opacity: 1, duration: SHOWCASE_CROSS, ease: 'none' },
              projectsPhaseStart
            )
          } else {
            const fadeInStart = projectsPhaseStart + i * PER_SHOWCASE_SLIDE - SHOWCASE_CROSS
            heroScrollTl.fromTo(
              actions,
              { opacity: 0 },
              { opacity: 1, duration: SHOWCASE_CROSS, ease: 'none' },
              fadeInStart
            )
          }
          if (i < SHOWCASE_SLIDE_COUNT - 1) {
            heroScrollTl.to(
              actions,
              { opacity: 0, duration: SHOWCASE_CROSS, ease: 'none' },
              fadeOutStart
            )
          }
        }
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

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
        data-hero-frame
      >
        <div
          data-hero-frame-top
          className="absolute top-0 right-0 left-0 h-0 w-full bg-white will-change-[height]"
        />
        <div
          data-hero-frame-bottom
          className="absolute right-0 bottom-0 left-0 h-0 w-full bg-white will-change-[height]"
        />
        <div
          data-hero-frame-left
          className="absolute top-0 bottom-0 left-0 h-full w-0 bg-white will-change-[width]"
        />
        <div
          data-hero-frame-right
          className="absolute top-0 right-0 bottom-0 h-full w-0 bg-white will-change-[width]"
        />
      </div>

      <HomeFrameShowcase />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 md:py-12">
        <div
          ref={copyRef}
          className="relative z-[4] max-w-[72rem] pointer-events-none"
        >
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
              className="pointer-events-auto mt-11 flex w-full max-w-2xl flex-wrap items-center gap-3"
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
