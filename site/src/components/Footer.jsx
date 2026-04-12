import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <p className="text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Menos ruido. Más estructura. Mejor ejecución.</span>
          <span className="mx-2 text-border" aria-hidden>
            ·
          </span>
          Jorge Carlos Quevedo — jorgeCQ
        </p>
        <nav className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Link
            href="/#que-hago"
            className="transition-colors duration-200 hover:text-foreground"
          >
            Lo que hago
          </Link>
          <Link href="/work" className="transition-colors duration-200 hover:text-foreground">
            Trabajo
          </Link>
          <Link href="/services" className="transition-colors duration-200 hover:text-foreground">
            Profundización
          </Link>
          <Link href="/about" className="transition-colors duration-200 hover:text-foreground">
            Sobre mí
          </Link>
          <Link href="/contact" className="transition-colors duration-200 hover:text-foreground">
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  )
}
