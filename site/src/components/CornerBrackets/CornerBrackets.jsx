import { cn } from '@/lib/utils'

/** Minimal corner frame — one motif; stroke matches diagram line token. */
export function CornerBrackets({ children, className, bracketClassName }) {
  return (
    <div className={cn('relative', className)}>
      <span
        className={cn(
          'pointer-events-none absolute -left-1 -top-1 size-4 border-l border-t border-[color:var(--line-strong)]',
          bracketClassName
        )}
        aria-hidden
      />
      <span
        className={cn(
          'pointer-events-none absolute -bottom-1 -right-1 size-4 border-b border-r border-[color:var(--line-strong)]',
          bracketClassName
        )}
        aria-hidden
      />
      {children}
    </div>
  )
}
