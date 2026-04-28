'use client'

import Link from 'next/link'
import {
  MinimalButton,
  minimalButtonVariants,
} from '@/components/MinimalButton/MinimalButton'
import { SHOWCASE_PROJECTS } from '@/content/showcaseProjects'
import { cn } from '@/lib/utils'

export function HomeFrameShowcase() {
  return (
    <div
      data-hero-showcase
      className="pointer-events-none absolute inset-0 z-12 opacity-0 [visibility:hidden]"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-x-[10vw] inset-y-[15vh] overflow-hidden">
        <p
          data-showcase-legend
          className="pointer-events-none absolute top-5 right-5 z-30 font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground select-none"
        >
          1/5
        </p>

        <div className="relative h-full min-h-0 w-full">
          {SHOWCASE_PROJECTS.map((project, index) => (
            <div
              key={project.slug}
              data-showcase-slide={index}
              className="pointer-events-none absolute inset-0 opacity-0"
            >
              {/* Replace with local assets in public/ when ready */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/65 via-background/10 to-transparent"
                aria-hidden
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-8 pt-16 md:pb-10 md:pt-20">
                <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
                  <MinimalButton href={`/project/${project.slug}`} variant="solid" size="lg">
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
