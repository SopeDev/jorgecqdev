import { cn } from '@/lib/utils'

/**
 * Bloque editorial: pausa + afirmación. No es un párrafo de sección normal.
 * - `tone="statement"`: tipo grande, contenedor estrecho, alto contraste.
 * - `tone="supporting"`: copy secundario (p. ej. bajo el hero).
 * - `surface`: recuadro; `true` = #111113 (card), `"recess"` = #0B0B0C sobre fondos #111113.
 * - `layout="wide"`: statement más ancho (columna editorial dominante).
 */
export function StatementBlock({
  as: Comp = 'p',
  children,
  className,
  wrapperClassName,
  tone = 'statement',
  surface = false,
  layout = 'narrow',
  ...rest
}) {
  const isStatement = tone === 'statement'
  const wide = layout === 'wide'

  const innerClasses = cn(
    isStatement &&
      !wide &&
      'max-w-[min(22rem,88vw)] text-balance text-[1.375rem] font-semibold leading-[1.28] tracking-[-0.02em] text-foreground sm:max-w-[24rem] sm:text-2xl sm:leading-[1.3] md:max-w-[26rem] md:text-[1.65rem] md:leading-[1.32] lg:text-[1.85rem] lg:leading-[1.33]',
    isStatement &&
      wide &&
      'max-w-[min(36rem,100%)] text-balance text-[1.4rem] font-semibold leading-[1.3] tracking-[-0.02em] text-foreground sm:text-2xl sm:leading-[1.32] md:max-w-[38rem] md:text-[1.7rem] md:leading-[1.34] lg:text-[1.9rem] lg:leading-[1.35]',
    !isStatement &&
      'max-w-2xl text-base font-normal leading-relaxed tracking-normal text-muted-foreground md:text-lg',
    className
  )

  const inner = (
    <Comp className={innerClasses} {...rest}>
      {children}
    </Comp>
  )

  if (surface && isStatement) {
    const recess = surface === 'recess'
    return (
      <div
        className={cn(
          'rounded-sm border border-border px-6 py-8 md:px-8 md:py-9',
          recess ? 'bg-background' : 'bg-card',
          wrapperClassName
        )}
      >
        {inner}
      </div>
    )
  }

  return inner
}
