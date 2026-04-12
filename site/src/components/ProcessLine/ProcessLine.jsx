import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_STEPS = ['Entender', 'Estructurar', 'Construir', 'Ajustar']

/**
 * Secuencia horizontal: raíles y chevrons alineados al centro óptico (sin texto →).
 */
export function ProcessLine({ steps = DEFAULT_STEPS, className }) {
  return (
    <div
      className={cn(
        'w-full max-w-4xl border-y border-border',
        className
      )}
    >
      <p
        id="process-sequence-label"
        className="border-b border-border px-1 py-2.5 text-center text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground md:px-0 md:text-left md:text-xs"
      >
        Secuencia del proceso
      </p>
      <div className="overflow-x-auto md:overflow-visible">
        <div
          className="flex min-w-max items-center gap-0 px-3 py-4 md:min-w-0 md:w-full md:px-0 md:py-5"
          role="group"
          aria-labelledby="process-sequence-label"
        >
          {steps.map((label, i) => (
            <Fragment key={label}>
              {i > 0 ? (
                <span
                  className="flex h-9 min-w-[2.5rem] flex-1 items-center md:h-10"
                  aria-hidden
                >
                  <span className="h-px min-w-2 flex-1 bg-border" />
                  <ChevronRight
                    className="mx-0.5 size-4 shrink-0 text-muted-foreground/45 md:size-[0.95rem]"
                    strokeWidth={1.75}
                  />
                  <span className="h-px min-w-2 flex-1 bg-border" />
                </span>
              ) : null}
              <span className="shrink-0 text-sm font-medium tracking-tight text-foreground md:text-[0.9375rem]">
                {label}
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
