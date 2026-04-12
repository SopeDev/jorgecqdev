'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { MinimalButton } from '@/components/MinimalButton/MinimalButton'
import { HeroSystemField } from '@/components/HeroSystemField/HeroSystemField'
import { useMotionSafe } from '@/hooks/useMotionSafe'

export function HomeHero() {
  const copyRef = useRef(null)
  const { prefersReduced } = useMotionSafe()

  useEffect(() => {
    const copy = copyRef.current
    if (!copy) return

    const reveals = copy.querySelectorAll('[data-hero-reveal]')

    if (prefersReduced) {
      gsap.set(reveals, { opacity: 1, y: 0 })
      return
    }

    gsap.fromTo(
      reveals,
      { opacity: 0.82, y: 7 },
      {
        opacity: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.05,
      }
    )

    return () => {
      gsap.killTweensOf(reveals)
    }
  }, [prefersReduced])

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[min(90vh,52rem)] flex-col border-b border-border"
      aria-labelledby="hero-heading"
      data-hero-section
    >
      <HeroSystemField />
      <div
        className="pointer-events-none absolute inset-0 -z-10 field-radial-steel"
        aria-hidden
      />
      <div
        data-hero-noise
        className="noise-hero pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-20 pt-[clamp(4.5rem,16vh,10.5rem)] md:pb-28 md:pt-[clamp(3.5rem,10vh,6.5rem)]">
        <div className="grid w-full grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-7 lg:pr-5">
            <div
              className="pointer-events-none absolute -inset-x-6 -top-[10%] bottom-[-14%] z-0 md:-inset-x-10 md:-left-8 md:right-2"
              aria-hidden
            />
            <div ref={copyRef} className="relative z-[1]">
              <h1
                id="hero-heading"
                data-hero-title
                data-hero-reveal
                className="mx-auto max-w-[min(21rem,90vw)] text-balance text-center text-[length:var(--text-display)] font-extrabold leading-[var(--text-display-leading)] tracking-[-0.035em] text-foreground sm:max-w-xl md:mx-0 md:max-w-[min(30rem,92%)] md:pr-1 md:text-left lg:max-w-[min(32.5rem,94%)]"
              >
                Construyo sistemas que{' '}
                <span className="text-[color:var(--logo-teal)]">funcionan</span>.
              </h1>
              <p
                data-hero-deck
                data-hero-reveal
                className="mt-8 max-w-[min(19.5rem,90vw)] text-center text-[length:var(--text-deck)] font-normal leading-[var(--text-deck-leading)] text-muted-foreground sm:max-w-md md:mx-0 md:max-w-[min(27rem,94%)] md:pr-2 md:text-left md:text-[1.0625rem]"
              >
                Tomo ideas, problemas o procesos desordenados y los convierto en productos claros,
                utilizables y escalables.
              </p>
              <p
                data-hero-reveal
                className="mx-auto mt-6 max-w-sm text-center text-sm text-muted-foreground md:mx-0 md:max-w-md md:text-left"
              >
                Menos ruido. Más estructura. Mejor ejecución.
              </p>
              <div
                data-hero-reveal
                className="mx-auto mt-12 flex w-full max-w-md flex-wrap items-center justify-center gap-3 md:mx-0 md:justify-start"
              >
                <MinimalButton
                  href="#que-hago"
                  variant="outline"
                  size="lg"
                  className="border-white/[0.14] bg-background/45 text-foreground backdrop-blur-[2px] hover:bg-card-hover/85 md:border-white/[0.17]"
                >
                  Seguir leyendo
                </MinimalButton>
                <MinimalButton
                  href="/contact"
                  variant="ghost"
                  size="lg"
                  className="text-foreground/88 hover:bg-card-hover/55 hover:text-foreground"
                >
                  Contacto
                </MinimalButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
