import { cn } from '@/lib/utils'

/**
 * Vertical process spine — orthogonal line + mono indices. GSAP sets [data-active] on li for highlight.
 */
export function ProcessRail({ steps, className }) {
  return (
    <nav
      className={cn('relative pl-0', className)}
      aria-label="Secuencia del proceso"
      data-process-rail
    >
      <div className="absolute bottom-2 left-[0.55rem] top-2 w-px bg-[color:var(--line-diagram)]" aria-hidden />
      <ol className="relative space-y-6 md:space-y-8">
        {steps.map((label, i) => {
          const n = String(i + 1).padStart(2, '0')
          return (
            <li
              key={label}
              className="flex gap-3 md:gap-4 transition-colors duration-200 [&[data-active=true]>span:first-child]:border-primary-stroke [&[data-active=true]>span:first-child]:text-foreground [&[data-active=true]>.process-rail-label]:text-foreground"
              data-process-step={i}
            >
              <span
                className="relative z-[1] flex size-[1.125rem] shrink-0 items-center justify-center rounded-[1px] border border-[color:var(--line-diagram)] bg-surface-canvas font-mono text-[0.625rem] tabular-nums leading-none text-muted-foreground transition-colors duration-200"
                aria-hidden
              >
                {n}
              </span>
              <span className="process-rail-label pt-0.5 text-sm font-medium tracking-tight text-muted-foreground transition-colors duration-200 md:text-[0.9375rem]">
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
