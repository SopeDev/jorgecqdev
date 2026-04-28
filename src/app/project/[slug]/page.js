import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SHOWCASE_PROJECTS } from '@/content/showcaseProjects'

export function generateStaticParams() {
  return SHOWCASE_PROJECTS.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const project = SHOWCASE_PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <main className="min-h-[50svh] border-b border-border bg-background px-6 py-20 md:px-10">
      <p className="font-mono text-[0.68rem] tracking-[0.16em] text-muted-foreground">Caso</p>
      <h1 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em] text-foreground">
        {project.title}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-[length:var(--text-deck)] leading-[var(--text-deck-leading)] text-muted-foreground">
        Página de detalle en construcción. Más adelante: contexto, stack, y resultados.
      </p>
      <p className="mt-8">
        <Link
          href="/"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Volver al inicio
        </Link>
      </p>
    </main>
  )
}
