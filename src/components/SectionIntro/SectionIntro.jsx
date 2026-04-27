import { cn } from '@/lib/utils'

/**
 * Shared section intro: eyebrow → title → deck. Keeps rhythm via CSS vars (--intro-gap-*).
 */
export function SectionIntro({
  id,
  eyebrow,
  title,
  children,
  align = 'center',
  className,
  titleClassName,
  eyebrowClassName,
}) {
  const isLeft = align === 'left'

  return (
    <div className={cn(isLeft ? 'md:text-left' : 'text-center', className)}>
      <p
        className={cn(
          'font-mono text-[length:var(--text-label)] font-medium uppercase tracking-[0.14em] text-muted-foreground md:text-[length:var(--text-label-md)]',
          !isLeft && 'text-center',
          eyebrowClassName
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          'mt-[var(--intro-gap-eyebrow)] text-[length:var(--text-section)] font-semibold leading-[var(--text-section-leading)] tracking-tight text-foreground',
          titleClassName
        )}
      >
        {title}
      </h2>
      {children ? (
        <div
          className={cn(
            'mt-[var(--intro-gap-title)] max-w-2xl text-[length:var(--text-deck)] leading-[var(--text-deck-leading)] text-muted-foreground',
            !isLeft && 'mx-auto text-center'
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
