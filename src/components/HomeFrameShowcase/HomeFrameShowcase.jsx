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
      <div className="pointer-events-none absolute inset-x-[10vw] inset-y-[15vh] flex min-h-0 flex-col overflow-hidden">
        <p
          data-showcase-legend
          className="pointer-events-none absolute top-5 right-5 z-10 font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground select-none"
        >
          1/5
        </p>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          {SHOWCASE_PROJECTS.map((project, index) => (
            <div
              key={project.slug}
              data-showcase-slide={index}
              className="absolute inset-0 opacity-0"
            >
              {/* Replace with local assets in public/ when ready */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 mb-6 mt-5 flex h-[3rem] shrink-0 items-start justify-center">
          {SHOWCASE_PROJECTS.map((project, index) => (
            <div
              key={`actions-${project.slug}`}
              data-showcase-actions={index}
              className="pointer-events-auto absolute left-1/2 flex -translate-x-1/2 gap-3 opacity-0"
            >
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
                  'border-white/[0.18] bg-background/25 backdrop-blur-[2px] hover:bg-card-hover/85'
                )}
              >
                Visitar sitio
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
