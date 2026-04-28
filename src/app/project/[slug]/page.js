import { notFound } from 'next/navigation'
import { SHOWCASE_PROJECTS } from '@/content/showcaseProjects'
import { ProjectPageShell } from '@/components/ProjectPageShell/ProjectPageShell'

export function generateStaticParams() {
  return SHOWCASE_PROJECTS.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }) {
  const { slug } = await params
  const project = SHOWCASE_PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  return <ProjectPageShell project={project} />
}
