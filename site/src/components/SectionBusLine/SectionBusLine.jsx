import { cn } from '@/lib/utils'

/**
 * Horizontal system rail. Inner bar scales on X for GSAP (transform-only).
 * Motif rules: orthogonal, stroke token --line-diagram.
 */
export function SectionBusLine({ className }) {
  return (
    <div className={cn('pointer-events-none w-full', className)} aria-hidden data-bus-line>
      <div
        data-bus-line-inner
        className="h-px w-full max-w-2xl origin-left bg-[color:var(--line-diagram)]"
      />
    </div>
  )
}
