import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { SystemCard } from '@/components/SystemCard/SystemCard'
import { SERVICES_DEEP } from '@/content/siteNarrative'

export const metadata = {
  title: 'Profundización — jorgeCQ',
  description:
    'Detalle sobre tipos de sistemas. El hilo conductor sigue en inicio.',
}

export default function ServicesPage() {
  return (
    <main>
      <SectionWrapper compact>
        <ScrollReveal>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Profundización
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Más detalle
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Complemento de{' '}
            <Link href="/#que-hago" className="font-medium text-primary transition-opacity duration-200 hover:opacity-85">
              Lo que hago
            </Link>
            . Sin catálogo de agencia: solo criterio sobre qué encaja.
          </p>
        </ScrollReveal>
        <div className="mt-14 space-y-4 md:mt-16">
          {SERVICES_DEEP.map((s) => (
            <ScrollReveal key={s.title}>
              <SystemCard as="article">
                <h2 className="text-base font-semibold text-foreground">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </SystemCard>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
