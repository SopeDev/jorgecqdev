'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { BouncyLetters } from '@/components/BouncyLetters/BouncyLetters'

const NAV = [
  { href: '#proyectos', label: 'Proyectos' },
  { href: '/contact', label: 'Contacto' },
]

const publicAsset = (path) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`

export function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const panelRef = useRef(null)
  const linksRef = useRef([])
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const panel = panelRef.current
    const links = linksRef.current.filter(Boolean)
    if (!panel || links.length === 0) return

    gsap.killTweensOf(panel)
    gsap.killTweensOf(links)

    if (navOpen) {
      setMenuVisible(true)
      gsap.set(panel, { scaleX: 0, scaleY: 0, transformOrigin: 'top left' })
      gsap.set(links[0], { x: -800 })
      gsap.set(links[1], { x: 800 })

      gsap
        .timeline()
        .to(panel, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.72,
          ease: 'power3.out',
        })
        .to(
          links[0],
          {
            x: 0,
            duration: 0.58,
            ease: 'power3.out',
          },
          0.5
        )
        .to(
          links[1],
          {
            x: 0,
            duration: 0.58,
            ease: 'power3.out',
          },
          0.58
        )
      return
    }

    if (!menuVisible) return

    gsap
      .timeline({
        onComplete: () => setMenuVisible(false),
      })
      .to(links[0], {
        x: -800,
        duration: 0.48,
        ease: 'power3.in',
      })
      .to(
        links[1],
        {
          x: 800,
          duration: 0.48,
          ease: 'power3.in',
        },
        0.08
      )
      .to(
        panel,
        {
          scaleX: 0,
          scaleY: 0,
          duration: 0.58,
          ease: 'power3.inOut',
        },
        0.5
      )
  }, [navOpen, menuVisible])

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

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fullscreenNav = (
    <div
      id="fullscreen-nav"
      className={cn(
        'fixed inset-0 z-[70] transition-opacity duration-200',
        menuVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Navegación"
      aria-hidden={!menuVisible}
    >
      <div
        ref={panelRef}
        className="absolute left-0 top-0 z-[1] h-screen w-screen origin-top-left scale-0 overflow-hidden bg-background will-change-transform"
      />
      <nav
        className="relative z-[2] flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center"
        aria-label="Principal"
      >
        <div className="inline-flex min-h-[14rem] overflow-hidden px-3 py-5">
          <div className="flex flex-col items-center justify-center gap-6">
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  linksRef.current[index] = el
                }}
                className="py-2 text-[clamp(1.7rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[0.2em] uppercase text-foreground"
                onClick={() => setNavOpen(false)}
              >
                <BouncyLetters text={item.label} />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )

  return (
    <header
      className="fixed top-0 z-[80] w-full bg-transparent"
    >
      <div className="relative h-[86px] w-full">
        <button
          type="button"
          className="group absolute left-[30px] top-[30px] z-[90] flex size-10 cursor-pointer items-center justify-center rounded-sm text-foreground"
          aria-expanded={navOpen}
          aria-controls="fullscreen-nav"
          aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setNavOpen((o) => !o)}
        >
          <span
            className={cn(
              'relative block h-[30px] w-[30px] transition-transform duration-[250ms] ease-[cubic-bezier(.2,.7,.3,.9)]',
              navOpen ? 'rotate-[180deg] group-hover:rotate-[270deg]' : 'rotate-0'
            )}
            aria-hidden
          >
            <span
              className={cn(
                'absolute left-[2px] h-[2px] bg-foreground transition-[background-color,width,transform,top,left] duration-[250ms] ease-[cubic-bezier(.2,.7,.3,.9)]',
                navOpen
                  ? 'top-[12px] w-[26px] rotate-[-45deg]'
                  : 'top-[4px] w-[26px] rotate-0'
              )}
            />
            <span
              className={cn(
                'absolute left-[2px] h-[2px] bg-foreground transition-[background-color,width,transform,top,left] duration-[250ms] ease-[cubic-bezier(.2,.7,.3,.9)]',
                navOpen
                  ? 'top-[12px] left-[12px] w-0'
                  : 'top-[14px] w-[18px] group-hover:w-[26px]'
              )}
            />
            <span
              className={cn(
                'absolute left-[2px] h-[2px] bg-foreground transition-[background-color,width,transform,top,left] duration-[250ms] ease-[cubic-bezier(.2,.7,.3,.9)]',
                navOpen
                  ? 'top-[12px] w-[26px] rotate-[45deg]'
                  : 'top-[24px] w-[10px] rotate-0 group-hover:w-[26px]'
              )}
            />
          </span>
        </button>

        <Link
          href="/"
          className="absolute right-[30px] top-[30px] z-[90] flex items-center text-foreground transition-opacity duration-200 hover:opacity-80"
          onClick={() => setNavOpen(false)}
        >
          <Image
            src={publicAsset('/logo.png')}
            alt="jorgeCQ"
            width={1366}
            height={460}
            className="h-8 w-auto rounded-sm md:h-9"
            priority
          />
        </Link>
      </div>
      {isMounted ? createPortal(fullscreenNav, document.body) : null}
    </header>
  )
}
