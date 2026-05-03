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
    let onResizeIntro = () => {}
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
      const heroCopy = copy
      const systemField = section.querySelector('[data-hero-system-field]')
      const focusNodeLayer = section.querySelector('[data-hero-focus-node-layer]')
      const scrollIndicator = section.querySelector('[data-hero-scroll-indicator]')
      const scrollIndicatorLine = section.querySelector('[data-hero-scroll-line]')
      const scrollIndicatorLabel = section.querySelector('[data-hero-scroll-label]')
      const focusBlock = section.querySelector('[data-focus-block]')
      const focusHeading = section.querySelector('[data-focus-heading-line]')
      const focusTitleParts = section.querySelectorAll('[data-focus-title-part]')
      const focusLines = section.querySelectorAll('[data-focus-line]')
      const howWorkBlock = section.querySelector('[data-how-work-block]')
      const howWorkLegend = section.querySelector('[data-how-work-legend]')
      const howWorkLines = section.querySelectorAll('[data-how-work-line]')
      const howWorkSteps = section.querySelectorAll('[data-how-work-step]')
      const finalCtaBlock = section.querySelector('[data-final-cta-block]')
      const finalCtaText = section.querySelector('[data-final-cta-text]')
      const finalCtaButton = section.querySelector('[data-final-cta-button]')
      const focusClipRevealEls = [...focusTitleParts].filter(Boolean)
      const titleInDelay = 0.12
      const titleInDuration = 1.2
      const titleInStagger = 0.3
      const paragraphInDelay =
        titleInDelay + titleInDuration + titleInStagger * Math.max(0, titleLines.length - 1) + 0.08
      const indicatorInDelay = paragraphInDelay + 0.5
      /**
       * Timeline units: 4 per 100lvh of pin scroll. Example: 1 unit = 25lvh.
       */
      const UNITS_PER_VH = 4
      const SCROLL_DISTANCE_SCALE = 0.6
      /** Narrow screens: slower scrub via extra scroll distance (multiplier on pin end). */
      const mobileScrollSlowFactor = () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 767px)').matches
          ? 1.5
          : 1
      const SEG_HERO = 4
      const SEG_ENF = 4
      /** 25vh gap between "Mi enfoque" header and Enfoque title reveal. */
      const ENFOQUE_HEADER_GAP = 1
      const T_ENFO = SEG_HERO
      const T_BODY = SEG_HERO + SEG_ENF + ENFOQUE_HEADER_GAP
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
      const focusLinesStart =
        focusTitleStart + focusTitleDuration + focusTitleStagger + 0.28
      const focusLinesDuration = 2
      /** Start scatter after Enfoque copy finishes. */
      const paragraphRevealEnd = focusLinesStart + focusLinesDuration
      const scatterPhaseStart = paragraphRevealEnd
      const scatterPhaseDuration = 6
      const enfoqueFadeOutStart = scatterPhaseStart + 1
      const enfoqueFadeOutDuration = 2
      /** Former frame window: tiles fade/scale in while scatter finishes (15 → 18). */
      const cardsPhaseStart = scatterPhaseStart + 3
      const cardsPhaseDuration = 3
      const focusNodes = { progress: 0 }
      const nodeScatter = { progress: 0 }
      const ambientCluster = { progress: 0 }

      let lastFocusAttr = '0'
      const setNodeFocusProgress = (value) => {
        if (!systemField) return
        systemField.__nodeFocusProgress = value
      }

      const setNodeScatterProgress = (value) => {
        if (!systemField) return
        systemField.__nodeScatterProgress = value
      }

      const setAmbientClusterProgress = (value) => {
        if (!systemField) return
        systemField.__ambientClusterProgress = value
      }

      const setAmbientStepProgress = (value) => {
        if (!systemField) return
        systemField.__ambientStepProgress = value
      }

      if (prefersReduced) {
        gsap.set(heroCopy, { opacity: 1 })
        gsap.set(titleLines, { yPercent: 0 })
        gsap.set(paragraph, { autoAlpha: 1 })
        gsap.set(actions, { autoAlpha: 1 })
        gsap.set(focusBlock, { autoAlpha: 1 })
        gsap.set(focusHeading, { opacity: 1, filter: 'blur(0px)' })
        gsap.set(focusClipRevealEls, { yPercent: 0 })
        gsap.set(focusLines, { opacity: 1 })
        setNodeFocusProgress(1)
        lastFocusAttr = '1'
        gsap.set(focusNodeLayer, { opacity: 0, filter: 'blur(14px)' })
        gsap.set(scrollIndicator, { opacity: 1 })
        gsap.set(scrollIndicatorLine, { scaleY: 1, transformOrigin: 'bottom center' })
        gsap.set(scrollIndicatorLabel, { opacity: 1, yPercent: 0 })
        const projectCards = section.querySelectorAll('[data-project-card]')
        const projectGridLabel = section.querySelector('[data-project-grid-label]')
        gsap.set(projectCards, { opacity: 1, scale: 1 })
        if (projectGridLabel) gsap.set(projectGridLabel, { opacity: 1, yPercent: 0 })
        setAmbientClusterProgress(1)
        setAmbientStepProgress(4)
        gsap.set(howWorkBlock, { autoAlpha: 1 })
        gsap.set(howWorkLegend, { opacity: 1, yPercent: 0 })
        gsap.set(howWorkLines, { opacity: 1, yPercent: 0 })
        gsap.set(howWorkSteps, { opacity: 1 })
        gsap.set(finalCtaBlock, { opacity: 1 })
        gsap.set(finalCtaText, { xPercent: 0 })
        gsap.set(finalCtaButton, { opacity: 1 })
        return
      }

      gsap.set(focusHeading, { opacity: 0, filter: 'blur(50px)' })
      gsap.set(focusClipRevealEls, { yPercent: 112 })
      gsap.set(focusLines, { opacity: 0, yPercent: 0 })
      gsap.set(heroCopy, { opacity: 1 })
      setNodeFocusProgress(0)
      setNodeScatterProgress(0)
      setAmbientClusterProgress(0)
      setAmbientStepProgress(0)
      gsap.set(focusNodeLayer, { opacity: 1, filter: 'blur(0px)' })
      gsap.set(howWorkBlock, { autoAlpha: 0 })
      gsap.set(howWorkLegend, { opacity: 0, yPercent: 24 })
      gsap.set(howWorkLines, { opacity: 0, yPercent: 24 })
      gsap.set(howWorkSteps, { opacity: 0 })
      gsap.set(finalCtaBlock, { opacity: 0 })
      gsap.set(finalCtaText, {
        xPercent: 112,
        force3D: true,
      })
      gsap.set(finalCtaButton, { opacity: 0 })
      const projectCards = section.querySelectorAll('[data-project-card]')
      const projectGridLabel = section.querySelector('[data-project-grid-label]')
      gsap.set(projectCards, {
        opacity: 0,
        scale: 0.88,
        transformOrigin: '50% 58%',
      })
      if (projectGridLabel) {
        gsap.set(projectGridLabel, {
          opacity: 0,
          yPercent: 18,
          transformOrigin: '0% 0%',
        })
      }

      /** Last staggered card finishes around start + amount + duration (random stagger window). */
      const cardsStaggerAmount =
        projectCards.length > 0
          ? Math.min(2.45, cardsPhaseDuration * 0.82)
          : 0
      const ambientClusterPhaseStart =
        cardsPhaseStart + cardsStaggerAmount + cardsPhaseDuration
      const viewportH =
        typeof window !== 'undefined'
          ? window.visualViewport?.height ?? window.innerHeight
          : 800
      /** Timeline slice whose scrub span equals ~100vh given pin mapping `UNITS_PER_VH`. */
      const ambientClusterPhaseDuration = Math.max(
        0.05,
        (UNITS_PER_VH * viewportH) /
          (Math.max(section.offsetHeight, 1) * mobileScrollSlowFactor())
      )
      /** Gap after project cards fully fade: 25vh worth of scroll. */
      const howWorkGapDuration = ambientClusterPhaseDuration * 0.25
      const howWorkPhaseStart =
        ambientClusterPhaseStart + ambientClusterPhaseDuration + howWorkGapDuration
      /** Requested: title/intro reveal now takes 50vh worth of scroll. */
      const howWorkPhaseDuration = ambientClusterPhaseDuration * 0.5
      const howWorkStepsStart = howWorkPhaseStart + howWorkPhaseDuration
      /** Each step now spans 50vh of scroll. */
      const howWorkStepDuration = ambientClusterPhaseDuration * 0.5
      /** Gap after final step before bottom-right CTA enters (25vh). */
      const finalCtaGapDuration = ambientClusterPhaseDuration * 0.25
      const finalCtaStart =
        howWorkStepsStart + howWorkStepDuration * howWorkSteps.length + finalCtaGapDuration
      const finalCtaTextDuration = ambientClusterPhaseDuration * 0.5
      const finalCtaButtonDuration = ambientClusterPhaseDuration * 0.3

      const heroScrollTl = gsap.timeline()

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
            autoAlpha: 0,
            duration: heroOutDuration,
            ease: 'none',
          },
          heroOutStart
        )
        .to(
          actions,
          {
            autoAlpha: 0,
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
            autoAlpha: 1,
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
            onComplete: () => setNodeScatterProgress(1),
          },
          scatterPhaseStart
        )
        .to(
          focusBlock,
          {
            autoAlpha: 0,
            duration: enfoqueFadeOutDuration,
            ease: 'none',
          },
          enfoqueFadeOutStart
        )

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
        if (projectGridLabel) {
          heroScrollTl.to(
            projectGridLabel,
            {
              opacity: 1,
              yPercent: 0,
              duration: cardsPhaseDuration,
              ease: 'power3.out',
            },
            cardsPhaseStart
          )
        }
      }

      heroScrollTl.to(
        ambientCluster,
        {
          progress: 1,
          duration: ambientClusterPhaseDuration,
          ease: 'sine.inOut',
          onUpdate: () => setAmbientClusterProgress(ambientCluster.progress),
          onComplete: () => setAmbientClusterProgress(1),
        },
        ambientClusterPhaseStart
      )
      heroScrollTl
        .to(
          howWorkBlock,
          {
            autoAlpha: 1,
            duration: howWorkPhaseDuration,
            ease: 'none',
          },
          howWorkPhaseStart
        )
        .to(
          howWorkLegend,
          {
            opacity: 1,
            yPercent: 0,
            duration: howWorkPhaseDuration,
            ease: 'none',
          },
          howWorkPhaseStart
        )
        .to(
          howWorkLines,
          {
            opacity: 1,
            yPercent: 0,
            duration: howWorkPhaseDuration,
            ease: 'none',
            stagger: 0.02,
          },
          howWorkPhaseStart
        )

      const ambientStep = { progress: 0 }
      heroScrollTl.to(
        ambientStep,
        {
          progress: 4,
          duration: howWorkStepDuration * 4,
          ease: 'none',
          onUpdate: () => setAmbientStepProgress(ambientStep.progress),
          onComplete: () => setAmbientStepProgress(4),
        },
        howWorkStepsStart
      )

      for (let i = 0; i < howWorkSteps.length; i++) {
        heroScrollTl.to(
          howWorkSteps[i],
          {
            opacity: 1,
            duration: howWorkStepDuration * 0.62,
            ease: 'none',
          },
          howWorkStepsStart + howWorkStepDuration * i
        )
      }

      heroScrollTl.to(
        finalCtaBlock,
        {
          opacity: 1,
          duration: 0.18,
          ease: 'none',
        },
        finalCtaStart
      )
      heroScrollTl
        .to(
          finalCtaText,
          {
            xPercent: 0,
            duration: finalCtaTextDuration,
            ease: 'none',
            force3D: true,
          },
          finalCtaStart
        )
        .to(
          finalCtaButton,
          {
            opacity: 1,
            duration: finalCtaButtonDuration,
            ease: 'none',
          },
          finalCtaStart + finalCtaTextDuration
        )

      if (projectCards.length) {
        const ambientGridFadeStart =
          ambientClusterPhaseStart + ambientClusterPhaseDuration * 0.5
        const ambientGridFadeDuration = ambientClusterPhaseDuration * 0.5
        heroScrollTl.to(
          projectCards,
          {
            opacity: 0,
            duration: ambientGridFadeDuration,
            ease: 'none',
          },
          ambientGridFadeStart
        )
        if (projectGridLabel) {
          heroScrollTl.to(
            projectGridLabel,
            {
              opacity: 0,
              duration: ambientGridFadeDuration,
              ease: 'none',
            },
            ambientGridFadeStart
          )
        }
      }

      ScrollTrigger.create({
        animation: heroScrollTl,
        trigger: section,
        start: 'top top',
        end: () =>
          `+=${section.offsetHeight * (heroScrollTl.duration() / UNITS_PER_VH) * mobileScrollSlowFactor() * SCROLL_DISTANCE_SCALE}`,
        pin: true,
        pinType: 'fixed',
        pinSpacing: true,
        scrub: 0.45,
        anticipatePin: 1,
        /**
         * `invalidateOnRefresh: true` makes ScrollTrigger call `timeline.revert().invalidate()`
         * on refresh, which resets scrubbed proxy props (scatter/focus progress) toward 0 and
         * flashes the canvases mid-scroll — noticeable on mobile when address bar/layout shifts.
         */
        invalidateOnRefresh: false,
      })

      const atPageTop = () => window.scrollY <= 2

      const setIntroToFinishedState = () => {
        gsap.set(heroCopy, { opacity: 1 })
        gsap.set(titleLines, { yPercent: 0 })
        gsap.set(paragraph, { autoAlpha: 1 })
        gsap.set(actions, { autoAlpha: 1 })
        gsap.set(scrollIndicator, { opacity: 1 })
        gsap.set(scrollIndicatorLine, { scaleY: 1, transformOrigin: 'bottom center' })
        gsap.set(scrollIndicatorLabel, { opacity: 1, yPercent: 0 })
      }

      const invalidatePinnedHeroBaseline = () => {
        heroScrollTl.invalidate()
      }

      const introTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          introSettled = true
          invalidatePinnedHeroBaseline()
          releaseScrollLock()
        },
      })

      const bypassIntro = () => {
        if (introSettled) return
        introSettled = true
        releaseScrollLock()
        introTl.progress(1).kill()
        setIntroToFinishedState()
        invalidatePinnedHeroBaseline()
        ScrollTrigger.refresh()
      }

      if (atPageTop()) {
        gsap.set(heroCopy, { opacity: 1 })
        gsap.set(titleLines, { yPercent: 112 })
        gsap.set(paragraph, { autoAlpha: 0 })
        gsap.set(actions, { autoAlpha: 0 })
        gsap.set(scrollIndicator, { opacity: 0 })
        gsap.set(scrollIndicatorLine, { scaleY: 0.1, transformOrigin: 'bottom center' })
        gsap.set(scrollIndicatorLabel, { opacity: 0, yPercent: 112 })
      } else {
        setIntroToFinishedState()
        invalidatePinnedHeroBaseline()
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
            autoAlpha: 1,
            duration: 0.55,
            ease: 'power2.out',
          },
          paragraphInDelay
        )
        .to(
          actions,
          {
            autoAlpha: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          paragraphInDelay
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
            duration: 0.65,
            ease: 'power2.out',
          },
          indicatorInDelay
        )
        .to(
          scrollIndicatorLabel,
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          indicatorInDelay + 0.65
        )

      onLateScrollCheck = () => {
        if (!atPageTop()) {
          bypassIntro()
        }
      }
      onResizeIntro = () => {
        if (!introSettled) {
          bypassIntro()
          return
        }
        invalidatePinnedHeroBaseline()
        ScrollTrigger.refresh()
      }
      window.addEventListener('load', onLateScrollCheck, { once: true })
      window.addEventListener('resize', onResizeIntro)
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
      window.removeEventListener('resize', onResizeIntro)
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
      className="relative isolate flex min-h-[100vh] flex-col overflow-hidden border-b border-border bg-background"
      aria-labelledby="hero-heading"
      data-hero-section
    >
      <HeroSystemField className="opacity-[0.95]" data-hero-system-field />
      <div
        data-hero-noise
        className="noise-hero pointer-events-none absolute inset-0 -z-10 opacity-85"
        aria-hidden
      />

      <HomeProjectCardsGrid />
      <div
        data-how-work-block
        className="pointer-events-none absolute inset-0 z-[32] flex items-center px-6 opacity-0 md:px-30"
        aria-hidden
      >
        <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-6 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-2 md:gap-x-10 md:gap-y-[20vh]">
          <div className="min-h-[14rem] md:col-start-1 md:row-start-1 md:min-h-[20rem]">
            <p
              data-how-work-legend
              className="font-mono text-[0.67rem] tracking-[0.18em] text-primary uppercase opacity-0 will-change-[opacity,transform]"
            >
              Cómo trabajo
            </p>
            <h2 className="mt-3 text-[clamp(1.35rem,2.3vw,2.55rem)] font-semibold leading-[1.04] tracking-[-0.032em] text-foreground">
              <span
                data-how-work-line
                className="block pb-[0.08em] opacity-0 will-change-[opacity,transform]"
              >
                Así convierto ideas
              </span>
              <span
                data-how-work-line
                className="block pb-[0.08em] opacity-0 will-change-[opacity,transform]"
              >
                en sistemas que
              </span>
              <span
                data-how-work-line
                className="block pb-[0.08em] text-primary opacity-0 will-change-[opacity,transform]"
              >
                realmente funcionan.
              </span>
            </h2>
          </div>
          <article
            data-how-work-step
            className="max-w-[28rem] opacity-0 will-change-[opacity,transform] md:col-start-2 md:row-start-1 md:self-end md:pb-5 md:pl-15"
          >
            <div className="flex items-start gap-4 md:gap-5">
              <p className="shrink-0 font-mono text-[2rem] leading-none tracking-[-0.04em] text-white/26">
                01
              </p>
              <div>
                <p className="text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold text-primary">Entender</p>
                <p className="mt-2 max-w-[28rem] text-[clamp(0.92rem,1vw,1.04rem)] leading-[1.65] text-muted-foreground">
                  Tu contexto, tu objetivo y lo que realmente está en juego — sin importar si estás
                  empezando desde cero o expandiendo algo que ya existe.
                </p>
              </div>
            </div>
          </article>
          <article
            data-how-work-step
            className="max-w-[28rem] opacity-0 will-change-[opacity,transform] md:col-start-3 md:row-start-1 md:self-end md:pr-15"
          >
            <div className="flex items-start gap-4 md:gap-5">
              <p className="shrink-0 font-mono text-[2rem] leading-none tracking-[-0.04em] text-white/26">
                02
              </p>
              <div>
                <p className="text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold text-primary">Definir</p>
                <p className="mt-2 max-w-[28rem] text-[clamp(0.92rem,1vw,1.04rem)] leading-[1.65] text-muted-foreground">
                  La solución correcta para tu caso — web, plataforma, dashboard, e-commerce o
                  automatización. Sin vender lo que no necesitas.
                </p>
              </div>
            </div>
          </article>
          <article
            data-how-work-step
            className="max-w-[28rem] opacity-0 will-change-[opacity,transform] md:col-start-2 md:row-start-2 md:pt-5 md:pr-15"
          >
            <div className="flex items-start gap-4 md:gap-5">
              <p className="shrink-0 font-mono text-[2rem] leading-none tracking-[-0.04em] text-white/26">
                03
              </p>
              <div>
                <p className="text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold text-primary">Construir</p>
                <p className="mt-2 max-w-[28rem] text-[clamp(0.92rem,1vw,1.04rem)] leading-[1.65] text-muted-foreground">
                  Scope claro, decisiones documentadas, entregas reales. Sin sorpresas a mitad del
                  camino.
                </p>
              </div>
            </div>
          </article>
          <article
            data-how-work-step
            className="max-w-[28rem] opacity-0 will-change-[opacity,transform] md:col-start-3 md:row-start-2 md:pt-15 md:pl-15"
          >
            <div className="flex items-start gap-4 md:gap-5">
              <p className="shrink-0 font-mono text-[2rem] leading-none tracking-[-0.04em] text-white/26">
                04
              </p>
              <div>
                <p className="text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold text-primary">Dejar una base</p>
                <p className="mt-2 max-w-[28rem] text-[clamp(0.92rem,1vw,1.04rem)] leading-[1.65] text-muted-foreground">
                  No solo que funcione hoy: que puedas operar, mantener y escalar sin depender de mí
                  para cada cambio.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 md:py-12">
        <div
          ref={copyRef}
          className="relative z-[30] max-w-[72rem] opacity-0 will-change-opacity pointer-events-none"
        >
          <div className="[&_*]:pointer-events-none">
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
              Plataformas, e-commerce, dashboards y herramientas a medida — para negocios que
              quieren crecer, automatizar y construir a largo plazo.
            </p>
          </div>

          <div
            data-hero-actions
            className="pointer-events-auto mt-11 flex w-full max-w-2xl flex-wrap items-center gap-3"
          >
            <MinimalButton href="/work" variant="solid" size="lg">
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
      <div className="pointer-events-none absolute inset-0 z-[31] flex items-center [&_*]:pointer-events-none">
        <div
          data-focus-block
          className="pointer-events-none mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 opacity-0 md:grid-cols-12 md:items-start md:gap-10"
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
        className="pointer-events-none absolute bottom-8 left-1/2 z-[35] -translate-x-1/2 opacity-0 md:bottom-3"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-4">
          <span className="overflow-hidden">
            <p
              data-hero-scroll-label
              className="text-[0.8rem] font-semibold tracking-[0.12em] text-foreground/95 uppercase will-change-[opacity,transform]"
            >
              Scroll
            </p>
          </span>
          <span
            data-hero-scroll-line
            className="block h-16 w-[2px] bg-foreground/90 md:h-24"
          />
        </div>
      </div>
      <div
        data-final-cta-block
        className="pointer-events-none absolute inset-x-0 bottom-6 z-[34] px-6 opacity-0 md:bottom-20 md:px-30"
        aria-hidden
      >
        <div className="pointer-events-none flex min-w-0 items-center justify-end gap-5 md:gap-8">
          <div className="min-w-0 overflow-hidden [&_*]:pointer-events-none">
            <p
              data-final-cta-text
              className="block text-right text-[clamp(0.92rem,1vw,1.04rem)] font-medium leading-[1.3] tracking-[-0.01em] text-foreground/80 will-change-transform"
            >
              ¿Hay algo que quieras convertir en un sistema real?
            </p>
          </div>
          <div data-final-cta-button className="pointer-events-auto opacity-0">
            <MinimalButton href="/contact" variant="solid" size="lg">
              Empecemos →
            </MinimalButton>
          </div>
        </div>
      </div>
    </section>
  )
}
