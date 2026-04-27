import Link from 'next/link'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const minimalButtonVariants = cva(
  'inline-flex items-center justify-center rounded-sm text-sm font-medium transition-[background-color,border-color,color,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/35',
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-transparent text-foreground hover:bg-card-hover',
        ghost:
          'border border-transparent text-muted-foreground hover:bg-card-hover hover:text-foreground',
        accent:
          'border border-primary/45 bg-transparent text-primary hover:bg-primary/10',
        solid:
          'border border-primary bg-primary text-primary-foreground hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4',
        lg: 'h-11 px-5 text-[0.9375rem]',
        cta: 'h-[3.25rem] min-h-[3.25rem] px-9 text-base font-medium tracking-tight md:h-14 md:min-h-[3.5rem] md:px-10 md:text-[1.0625rem]',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
)

export function MinimalButton({
  className,
  variant,
  size,
  href,
  type = 'button',
  children,
  ...props
}) {
  const cls = cn(minimalButtonVariants({ variant, size }), className)
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  )
}
