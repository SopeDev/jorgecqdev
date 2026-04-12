import { ScrollReveal } from '@/components/ScrollReveal'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { StatementBlock } from '@/components/StatementBlock/StatementBlock'

export const metadata = {
  title: 'Sobre mí — jorgeCQ',
  description:
    'No hago páginas bonitas por hacerlas. Orden, estructura y sistemas que funcionan en el mundo real.',
}

export default function AboutPage() {
  return (
    <main>
      <SectionWrapper compact className="min-h-[50vh]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-start">
            <ScrollReveal className="md:w-[min(30%,12.5rem)] md:flex-shrink-0 md:pr-6 lg:w-[min(28%,13.5rem)] lg:pr-8 lg:pt-2">
              <header>
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Perfil
                </p>
                <h1 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground md:mt-3 md:text-[1.125rem] lg:text-xl">
                  Sobre mí
                </h1>
              </header>
            </ScrollReveal>

            <div className="mt-11 border-t border-border pt-10 md:mt-0 md:flex-1 md:border-t-0 md:border-l md:border-border md:pt-1 md:pl-9 lg:pl-[2.85rem] xl:pl-[3.25rem]">
              <ScrollReveal className="space-y-6 md:space-y-7 lg:space-y-8">
                <StatementBlock
                  as="p"
                  tone="statement"
                  layout="wide"
                  surface
                  wrapperClassName="md:py-9 lg:py-10"
                  className="text-left"
                >
                  No hago &ldquo;páginas bonitas&rdquo; por hacerlas.
                </StatementBlock>
                <p className="max-w-[40rem] text-[0.9375rem] leading-[1.65] text-muted-foreground md:text-base md:leading-relaxed">
                  Trabajo con personas que ya tienen algo en movimiento — un negocio, una idea, un
                  proceso — pero necesitan ordenarlo, estructurarlo y llevarlo a algo real.
                </p>
                <p className="max-w-[40rem] text-[0.9375rem] leading-[1.65] text-muted-foreground md:text-base md:leading-relaxed">
                  Mi enfoque es simple: entender qué está pasando de verdad, quitar lo innecesario y
                  construir algo que funcione en el mundo real.
                </p>
                <p className="max-w-[38rem] text-[0.9375rem] font-medium leading-[1.6] text-foreground/95 md:text-base">
                  No me interesa inflar proyectos. Me interesa que funcionen.
                </p>
                <p className="max-w-[40rem] border-t border-border pt-8 text-sm text-muted-foreground md:pt-9">
                  — Jorge Carlos Quevedo (jorgeCQ)
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}
