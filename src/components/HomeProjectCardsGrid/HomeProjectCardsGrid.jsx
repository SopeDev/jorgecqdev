'use client'

import Link from 'next/link'
import { SHOWCASE_PROJECTS } from '@/content/showcaseProjects'
import { cn } from '@/lib/utils'

export function HomeProjectCardsGrid() {
  return (
    <div
      data-hero-project-grid
      className="pointer-events-none absolute inset-0 z-[11] flex items-center justify-center px-4 py-16 md:px-8 md:py-20"
      aria-hidden
    >
      <div className="pointer-events-none grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {SHOWCASE_PROJECTS.map((project, index) => (
          <article
            key={project.slug}
            data-project-card={index}
            className={cn(
              'group pointer-events-auto relative aspect-[5/4] overflow-hidden rounded-sm border border-white/[0.08]',
              'opacity-0 will-change-[opacity,transform]'
            )}
            style={{ backgroundColor: project.brandBg }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%)',
              }}
              aria-hidden
            />

            {!project.placeholder && project.imageSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.imageSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.22] mix-blend-overlay transition-opacity duration-500 group-hover:opacity-[0.38]"
              />
            ) : null}

            <div className="relative flex h-full flex-col items-center justify-center px-3 py-4">
              <span
                className="font-mono text-[clamp(1.75rem,6vw,2.75rem)] font-semibold tracking-[0.16em] text-white/92"
                style={{ color: project.accent }}
              >
                {project.monogram}
              </span>
              {!project.placeholder && (
                <span className="mt-3 max-w-[11rem] text-center font-mono text-[0.58rem] tracking-[0.22em] text-white/38 uppercase">
                  {project.client.split(' ')[0]}
                </span>
              )}
            </div>

            <div
              className={cn(
                'pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/92 via-background/55 to-transparent p-4 opacity-0 transition-opacity duration-300 ease-out md:p-5',
                'group-hover:pointer-events-auto group-hover:opacity-100'
              )}
            >
              <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                {project.placeholder ? 'Disponible' : project.client}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug tracking-[-0.02em] text-foreground md:text-[0.95rem]">
                {project.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {!project.placeholder && (
                  <Link
                    href={`/work#${project.slug}`}
                    className="rounded-sm border border-border bg-background/90 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-card-hover"
                  >
                    Ver caso
                  </Link>
                )}
                <Link
                  href={project.liveUrl}
                  target={project.liveUrl.startsWith('http') ? '_blank' : undefined}
                  rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'rounded-sm border px-3 py-2 text-xs font-medium transition-colors',
                    project.placeholder
                      ? 'border-primary/45 bg-primary/15 text-primary hover:bg-primary/25'
                      : 'border-white/[0.18] bg-background/55 text-foreground hover:bg-card-hover/90'
                  )}
                >
                  {project.placeholder ? 'Explorar trabajo' : 'Visitar sitio'}
                </Link>
              </div>
            </div>

            <span className="sr-only">{project.title}</span>
          </article>
        ))}
      </div>
    </div>
  )
}
