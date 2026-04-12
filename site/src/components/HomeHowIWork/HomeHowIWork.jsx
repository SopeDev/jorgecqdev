import { SectionIntro } from '@/components/SectionIntro/SectionIntro'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { ProcessLine } from '@/components/ProcessLine/ProcessLine'
import { ProcessRail } from '@/components/ProcessRail/ProcessRail'
import { HOW_I_WORK_PHASES } from '@/content/siteNarrative'

export function HomeHowIWork() {
  const stepLabels = HOW_I_WORK_PHASES.map((p) => p.title)

  return (
    <SectionWrapper id="como-trabajo" borderTop aria-labelledby="como-trabajo-heading">
      <SectionIntro
        id="como-trabajo-heading"
        eyebrow="Método"
        title="Proceso"
        align="left"
      >
        <p>
          Orden antes de código. Construcción con revisión. Sin prometer cero fricción.
        </p>
      </SectionIntro>

      <div className="mt-10 md:hidden">
        <ProcessLine steps={stepLabels} />
      </div>

      <div
        className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:items-start md:gap-10 lg:gap-14"
        data-process-layout
      >
        <div className="hidden md:col-span-4 lg:col-span-3 md:block">
          <div className="md:sticky md:top-28 lg:top-32" data-process-pin>
            <ProcessRail steps={stepLabels} />
          </div>
        </div>

        <ol className="mt-0 space-y-0 md:col-span-8 lg:col-span-9" data-process-steps>
          {HOW_I_WORK_PHASES.map((phase, index) => {
            const n = String(index + 1).padStart(2, '0')
            return (
              <li
                key={phase.title}
                data-process-phase={index}
                className="border-t border-border pt-8 first:border-t-0 first:pt-0 md:pt-10"
              >
                <div className="flex gap-3 md:gap-5">
                  <span
                    className="w-9 shrink-0 pt-0.5 text-left font-mono text-[0.6875rem] tabular-nums leading-none tracking-normal text-muted-foreground md:hidden md:w-10 md:text-xs"
                    aria-hidden
                  >
                    {n}
                  </span>
                  <div className="min-w-0 flex-1 border-l border-[color:var(--line-subtle)] pl-4 md:max-w-[40rem] md:pl-5">
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">
                      {phase.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-[0.9375rem]">
                      {phase.body}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </SectionWrapper>
  )
}
