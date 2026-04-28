'use client'

import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

export function ProjectPageShell({ project }) {
  const shellRef = useRef(null)

  useLayoutEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const heroOverlay = shell.querySelector('[data-project-hero-overlay]')
    if (!heroOverlay) return

    gsap.fromTo(
      heroOverlay,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.44,
        delay: 0.02,
        ease: 'power2.out',
      }
    )
  }, [project.slug])

  return (
    <main ref={shellRef} className="border-b border-border bg-background">
      <section className="relative h-[100lvh] min-h-[34rem] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.imageSrc}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div
          data-project-hero-overlay
          className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-b from-black/20 via-black/10 to-background/80"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10 md:pb-10">
          <p
            className="font-mono text-[0.66rem] tracking-[0.16em] text-white/70 uppercase"
          >
            {project.client}
          </p>
          <h1
            className="mt-2 max-w-4xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-white"
          >
            {project.title}
          </h1>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <p
          className="font-mono text-[0.68rem] tracking-[0.16em] text-muted-foreground"
        >
          Caso
        </p>
        <p
          className="mt-6 max-w-2xl text-pretty text-[length:var(--text-deck)] leading-[var(--text-deck-leading)] text-muted-foreground"
        >
          Página de detalle en construcción. Más adelante: contexto, stack, y resultados.
        </p>
        <p className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </p>
      </section>
    </main>
  )
}
