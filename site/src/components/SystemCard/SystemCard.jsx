import { cn } from '@/lib/utils'

/**
 * Panel editorial — no tarjeta genérica de producto.
 * @param {'standard' | 'inset' | 'panel'} tone — matiz de fondo respecto al bloque padre
 * @param {'tight' | 'comfortable' | 'airy'} spacing — variación de aire interno
 */
export function SystemCard({
  as: Comp = 'div',
  children,
  className,
  tone = 'standard',
  spacing = 'comfortable',
  emphasis = false,
  ...rest
}) {
  return (
    <Comp
      className={cn(
        'group rounded-sm border border-border text-card-foreground',
        'transition-[transform,border-color,background-color] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:border-white/[0.14] md:hover:-translate-y-1',
        tone === 'standard' && 'bg-surface-panel',
        tone === 'inset' && 'bg-background',
        tone === 'panel' && 'bg-surface-elevated',
        spacing === 'tight' && 'px-5 py-6 md:px-6 md:pb-8 md:pt-7',
        spacing === 'comfortable' && 'p-6 py-7 md:px-7 md:py-8',
        spacing === 'airy' && 'p-7 py-8 md:p-8 md:pb-11 md:pt-9',
        emphasis &&
          'border-l-[3px] border-l-primary/40 bg-surface-emphasis pl-[1.35rem] md:border-l-primary/45 md:pl-7',
        emphasis && tone === 'inset' && 'bg-surface-deeper',
        'hover:bg-[#151518]',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}
