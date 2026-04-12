'use client'

import Link from 'next/link'
import { SectionIntro } from '@/components/SectionIntro/SectionIntro'
import { SectionBusLine } from '@/components/SectionBusLine/SectionBusLine'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { SystemCard } from '@/components/SystemCard/SystemCard'
import { WHAT_I_DO_BLOCKS } from '@/content/siteNarrative'
import { cn } from '@/lib/utils'
import { SystemsSectionMotion } from '@/components/HomeWhatIDo/SystemsSectionMotion'

function FieldLabel({ children, className }) {
  return (
    <p
      className={cn(
        'mt-4 font-mono text-[length:var(--text-label)] font-medium normal-case tracking-[0.04em] text-muted-foreground/75 md:text-[length:var(--text-label-md)]',
        className
      )}
    >
      {children}
    </p>
  )
}

function partitionBlocks(blocks) {
  const copy = [...blocks]
  const ei = copy.findIndex((b) => b.systemsGrid?.emphasis)
  if (ei === -1) return { anchor: null, rest: copy }
  const [anchor] = copy.splice(ei, 1)
  return { anchor, rest: copy }
}

export function HomeWhatIDo() {
  const { anchor, rest } = partitionBlocks(WHAT_I_DO_BLOCKS)

  return (
    <SectionWrapper
      id="que-hago"
      variant="surface"
      borderTop
      aria-labelledby="que-hago-heading"
      className="relative overflow-hidden"
    >
      <div
        className="noise-ambient pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      />

      <SystemsSectionMotion>
        <SectionIntro
          id="que-hago-heading"
          eyebrow="Alcance"
          title="Lo que hago"
          align="left"
          className="relative"
        >
          <p>
            No son servicios aislados. Son <span className="text-foreground">sistemas</span>: piezas
            que encajan con una operación o un producto, no entregables sueltos.
          </p>
        </SectionIntro>

        <div className="mt-8 md:mt-10" data-systems-bus>
          <SectionBusLine className="max-w-2xl" />
        </div>

        <div className="mt-12 space-y-7 md:mt-14 md:space-y-8">
          {anchor ? (
            <div data-systems-card="anchor">
              <SystemCard
                as="article"
                tone={anchor.systemsGrid?.tone ?? 'standard'}
                spacing={anchor.systemsGrid?.spacing ?? 'comfortable'}
                emphasis={anchor.systemsGrid?.emphasis}
                className="h-auto"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">01</span>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                    {anchor.title}
                  </h3>
                </div>
                <FieldLabel className="mt-5 md:mt-6">Situación</FieldLabel>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                  {anchor.situation}
                </p>
                <FieldLabel>Qué construyo</FieldLabel>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                  {anchor.build}
                </p>
                <FieldLabel>Qué gana el negocio</FieldLabel>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                  {anchor.outcome}
                </p>
              </SystemCard>
            </div>
          ) : null}

          <div className="grid auto-rows-auto grid-cols-1 items-start gap-y-7 md:grid-cols-2 md:gap-x-6 md:gap-y-8">
            {rest.map((block, idx) => {
              const g = block.systemsGrid ?? {
                tone: 'standard',
                spacing: 'comfortable',
                emphasis: false,
              }
              const n = anchor ? idx + 2 : idx + 1
              const staggerClass =
                idx % 2 === 1 ? 'md:translate-y-4 lg:translate-y-6' : ''
              return (
                <div
                  key={block.title}
                  data-systems-card={idx}
                  className={cn(staggerClass, 'transition-transform duration-200')}
                >
                  <SystemCard
                    as="article"
                    tone={g.tone}
                    spacing={g.spacing}
                    emphasis={g.emphasis}
                    className="h-auto"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {String(n).padStart(2, '0')}
                      </span>
                      <h3
                        className={
                          g.emphasis
                            ? 'text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl'
                            : 'text-base font-semibold leading-snug tracking-tight text-foreground'
                        }
                      >
                        {block.title}
                      </h3>
                    </div>
                    <FieldLabel className="mt-5 md:mt-6">Situación</FieldLabel>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                      {block.situation}
                    </p>
                    <FieldLabel>Qué construyo</FieldLabel>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                      {block.build}
                    </p>
                    <FieldLabel>Qué gana el negocio</FieldLabel>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
                      {block.outcome}
                    </p>
                  </SystemCard>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-12 text-sm text-muted-foreground md:text-left">
          Más detalle:{' '}
          <Link
            href="/services"
            className="font-medium text-primary transition-opacity duration-200 hover:opacity-85"
          >
            profundización
          </Link>
        </p>
      </SystemsSectionMotion>
    </SectionWrapper>
  )
}
