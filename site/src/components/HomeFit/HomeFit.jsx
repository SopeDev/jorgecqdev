import { SectionIntro } from '@/components/SectionIntro/SectionIntro'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { IDEAL_CLIENT_POINTS, NOT_IDEAL_CLIENT_POINTS } from '@/content/siteNarrative'

export function HomeFit() {
  return (
    <SectionWrapper id="encaje" borderTop aria-labelledby="encaje-heading">
      <SectionIntro id="encaje-heading" eyebrow="Filtro" title="Encaje" align="left">
        <p className="max-w-xl">
          No trabajo con todos los proyectos. Solo con los que tienen sentido hacer bien. Esto ayuda a
          ambos a no perder el tiempo.
        </p>
      </SectionIntro>

      <div
        className="mt-14 grid grid-cols-1 items-stretch gap-10 md:mt-16 md:grid-cols-12 md:gap-0 lg:mt-[4.25rem]"
        data-encaje-columns
      >
        <article className="flex flex-col md:col-span-7 md:pr-8 lg:col-span-7 lg:pr-10">
          <h3 className="text-base font-semibold leading-snug text-foreground md:text-[1.0625rem]">
            Tiene sentido si…
          </h3>
          <ul className="mt-7 list-outside list-disc space-y-4 pl-5 text-sm leading-[1.55] text-muted-foreground marker:text-muted-foreground/50 md:mt-8 md:space-y-5 md:pl-6 md:text-[0.9375rem] md:leading-[1.65]">
            {IDEAL_CLIENT_POINTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <div
          className="relative hidden min-h-[12rem] md:col-span-1 md:flex md:justify-center"
          data-encaje-divider
          aria-hidden
        >
          <span className="encaje-divider-line relative min-h-[10rem] w-px self-stretch bg-[color:var(--line-strong)]">
            <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] border border-[color:var(--line-strong)] bg-surface-canvas" />
          </span>
        </div>

        <article className="rounded-sm border border-border bg-surface-recess px-5 py-7 md:col-span-4 md:px-6 md:py-8 lg:px-8 lg:py-9">
          <h3 className="text-base font-semibold leading-snug text-foreground md:text-[1.0625rem]">
            Probablemente no si…
          </h3>
          <ul className="mt-7 list-outside list-disc space-y-4 pl-5 text-sm leading-[1.55] text-muted-foreground marker:text-muted-foreground/45 md:mt-8 md:space-y-5 md:pl-6 md:text-[0.9375rem] md:leading-[1.65]">
            {NOT_IDEAL_CLIENT_POINTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-8 border-t border-border pt-8 md:hidden" aria-hidden />
    </SectionWrapper>
  )
}
