import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { StatementBlock } from '@/components/StatementBlock/StatementBlock'
import { MinimalButton } from '@/components/MinimalButton/MinimalButton'
import { CornerBrackets } from '@/components/CornerBrackets/CornerBrackets'

export function HomeClosingCta() {
  return (
    <>
      <SectionWrapper
        id="cierre"
        variant="surface"
        borderTop
        aria-labelledby="cierre-heading"
        innerClassName="py-32 md:py-44 lg:py-[13rem]"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7" data-cta-content>
            <CornerBrackets>
              <p className="font-mono text-[length:var(--text-label)] font-medium uppercase tracking-[0.14em] text-muted-foreground md:text-[length:var(--text-label-md)]">
                Contacto
              </p>
              <h2
                id="cierre-heading"
                className="mt-[var(--intro-gap-eyebrow)] text-[length:var(--text-section)] font-semibold leading-[var(--text-section-leading)] tracking-tight text-foreground md:text-2xl"
              >
                Siguiente paso
              </h2>
              <StatementBlock
                tone="statement"
                surface="recess"
                layout="wide"
                wrapperClassName="mt-10 md:mt-12"
                className="text-left !max-w-none max-w-full"
              >
                Si tienes algo que quieres construir — o algo que ya no está funcionando como debería —
                podemos verlo.
              </StatementBlock>
              <p className="mt-8 text-sm leading-relaxed text-muted-foreground md:mt-9">
                No acepto todos los encargos: solo los que merecen hacerse con calma y criterio.
              </p>
              <div className="mt-14 md:mt-16">
                <MinimalButton href="/contact" variant="outline" size="cta">
                  Contactar
                </MinimalButton>
              </div>
            </CornerBrackets>
          </div>
          <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <p className="border-l border-[color:var(--line-subtle)] pl-5 font-mono text-xs leading-relaxed text-muted-foreground">
              Respuesta orientada a encaje, no a volumen de propuestas.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
        aria-hidden
      />
    </>
  )
}
