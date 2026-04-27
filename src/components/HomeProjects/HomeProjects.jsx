import Link from 'next/link'
import { SectionIntro } from '@/components/SectionIntro/SectionIntro'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { WorkProjectItem } from '@/components/WorkProjectItem/WorkProjectItem'
import { FEATURED_PROJECTS } from '@/content/siteNarrative'

export function HomeProjects() {
  return (
    <SectionWrapper
      id="proyectos"
      variant="surface"
      borderTop
      aria-labelledby="proyectos-heading"
      className="relative overflow-hidden"
    >
      <div className="noise-ambient pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <SectionIntro
        id="proyectos-heading"
        eyebrow="Referencias"
        title="Trabajo"
        align="left"
      >
        <p>
          Casos y referencias. Contexto, qué se construyó y qué aporta — sin maquillar demos como
          clientes.
        </p>
      </SectionIntro>

      <div
        className="relative mx-auto mt-14 max-w-3xl md:mt-16 md:max-w-4xl md:pl-10 lg:pl-12"
        data-work-list
      >
        <div
          className="pointer-events-none absolute bottom-8 left-0 top-8 hidden w-px bg-[color:var(--line-diagram)] md:block md:left-[0.15rem] lg:left-1"
          aria-hidden
        />
        {FEATURED_PROJECTS.map((project, index) => (
          <WorkProjectItem key={project.slug} project={project} index={index} titleAs="h3" />
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground md:mt-14">
        <Link
          href="/work"
          className="font-medium text-primary transition-opacity duration-200 hover:opacity-85"
        >
          Ver todo en una página
        </Link>
      </p>
    </SectionWrapper>
  )
}
