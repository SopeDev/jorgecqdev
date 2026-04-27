import { cn } from '@/lib/utils'

export function SectionWrapper({
  id,
  children,
  className,
  innerClassName,
  variant = 'default',
  borderTop = false,
  compact = false,
  depth = false,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'scroll-mt-16',
        borderTop && 'border-t border-border',
        variant === 'surface' && 'bg-muted',
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl px-6',
          compact && 'py-16 md:py-20',
          !compact &&
            !depth &&
            'py-[var(--section-py)] md:py-[var(--section-py-md)]',
          !compact && depth && 'py-[var(--section-py-deep)] md:py-[var(--section-py-deep-md)]',
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
