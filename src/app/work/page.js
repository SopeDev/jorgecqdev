import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { WorkProjectItem } from '@/components/WorkProjectItem/WorkProjectItem'
import { FEATURED_PROJECTS } from '@/content/siteNarrative'

export const metadata = {
  title: 'Trabajo — jorgeCQ',
  description:
    'Referencias y casos: contexto, sistema y resultado. Demos marcadas como concepto.',
}

export default function WorkPage() {
  return (
    <main>
      <SectionWrapper compact>
        <ScrollReveal>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Referencias
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trabajo
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Misma curaduría que en inicio. Proyectos reales y demos etiquetadas.
          </p>
          <p className="mt-6 text-sm">
            <Link
              href="/#proyectos"
              className="font-medium text-primary transition-opacity duration-200 hover:opacity-85"
            >
              Volver a inicio
            </Link>
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 max-w-3xl md:mt-16 md:max-w-4xl">
          {FEATURED_PROJECTS.map((project, index) => (
            <ScrollReveal key={project.slug}>
              <WorkProjectItem project={project} index={index} titleAs="h2" ledger={false} />
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
