'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/work', label: 'Trabajo' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' },
]

const publicAsset = (path) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:h-16">
        <Link
          href="/"
          className="flex items-center text-foreground transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src={publicAsset('/logo-white.png')}
            alt="jorgeCQ"
            width={1366}
            height={460}
            className="h-8 w-auto rounded-sm md:h-9"
            priority
          />
        </Link>
        <nav className="hidden gap-10 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
