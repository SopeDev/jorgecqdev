import { ProjectKindBadge } from '@/components/ProjectKindBadge/ProjectKindBadge'
import { cn } from '@/lib/utils'

/** Ritmo irregular entre entradas (sin simetría de cuadrícula). */
const PAD_BOTTOM = [
  'pb-12 md:pb-[3.75rem]',
  'pb-16 md:pb-20',
  'pb-10 md:pb-14',
  'pb-14 md:pb-[4.25rem]',
  'pb-11 md:pb-16',
  'pb-[3.25rem] md:pb-[4rem]',
]

function BlockLabel({ children }) {
  return (
    <p className="font-mono text-[length:var(--text-label)] font-medium normal-case tracking-[0.04em] text-muted-foreground/80 md:text-[length:var(--text-label-md)]">
      {children}
    </p>
  )
}

export function WorkProjectItem({ project, index, titleAs = 'h3', ledger = true }) {
  const Title = titleAs === 'h2' ? 'h2' : 'h3'
  const pad = PAD_BOTTOM[index % PAD_BOTTOM.length]
  const num = String(index + 1).padStart(2, '0')
  const offsetLedger = ledger && index % 2 === 1

  return (
    <article
      data-work-item={index}
      className={cn(
        'relative border-b border-border/90',
        pad,
        'last:border-b-0',
        offsetLedger && 'md:ml-5 lg:ml-8'
      )}
    >
      {ledger ? (
        <div
          className="pointer-events-none absolute -left-1 top-1 hidden font-mono text-[0.6875rem] tabular-nums text-muted-foreground md:block md:-left-1 lg:left-0"
          aria-hidden
        >
          <span className="block w-8 lg:w-10">{num}</span>
          <span className="mx-auto mt-1 block h-16 w-px bg-[color:var(--line-diagram)] lg:h-20" />
        </div>
      ) : null}

      <div className={cn(ledger && 'md:pl-8 lg:pl-11')}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <Title className="text-xl font-semibold leading-tight tracking-tight text-foreground md:text-2xl">
            {project.title}
          </Title>
          <ProjectKindBadge kind={project.kind} />
        </div>

        <div className="mt-6 space-y-6 md:mt-8 md:space-y-7">
          <div className="max-w-2xl">
            <BlockLabel>Contexto</BlockLabel>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
              {project.context}
            </p>
          </div>
          <div className="max-w-2xl border-t border-border/70 pt-6 md:max-w-[42rem] md:pt-7">
            <BlockLabel>Sistema</BlockLabel>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
              {project.system}
            </p>
          </div>
          <div className="max-w-2xl border-t border-border/70 pt-6 md:pt-7">
            <BlockLabel>Resultado</BlockLabel>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
              {project.result}
            </p>
          </div>
        </div>

        {project.url ? (
          <p className="mt-6 text-sm md:mt-8">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary transition-opacity duration-200 hover:opacity-85"
            >
              Visitar sitio
            </a>
          </p>
        ) : null}
      </div>
    </article>
  )
}
