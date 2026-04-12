import { cn } from '@/lib/utils'

export function ProjectKindBadge({ kind }) {
  const isReal = kind === 'real'
  return (
    <span
      className={cn(
        'rounded-sm border px-2 py-0.5 text-xs font-medium',
        isReal
          ? 'border-primary/35 text-primary'
          : 'border-border bg-transparent text-muted-foreground'
      )}
    >
      {isReal ? 'Proyecto real' : 'Concepto / demo'}
    </span>
  )
}
