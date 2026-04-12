'use client'

import { useEffect, useState } from 'react'
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
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (!navOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [navOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:h-16">
        <Link
          href="/"
          className="flex items-center text-foreground transition-opacity duration-200 hover:opacity-80"
          onClick={() => setNavOpen(false)}
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
        <nav
          className="hidden gap-10 md:flex"
          aria-label="Principal"
        >
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
        <button
          type="button"
          className="relative z-[60] flex size-10 items-center justify-center rounded-sm border border-border text-foreground md:hidden"
          aria-expanded={navOpen}
          aria-controls="mobile-nav"
          aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setNavOpen((o) => !o)}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            {navOpen ? (
              <>
                <path d="M6 6l12 12M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>
      <div
        id="mobile-nav"
        className={cn(
          'fixed inset-x-0 top-14 z-50 max-h-[min(70vh,calc(100dvh-3.5rem))] overflow-y-auto border-b border-border bg-background/98 backdrop-blur-md md:hidden',
          navOpen ? 'block' : 'hidden'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navegación"
      >
        <nav className="flex flex-col px-6 py-5" aria-label="Principal móvil">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-border py-4 text-base font-medium text-foreground first:pt-0 last:border-b-0 last:pb-0"
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-14 z-40 bg-background/40 md:hidden"
          aria-label="Cerrar menú"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
    </header>
  )
}
