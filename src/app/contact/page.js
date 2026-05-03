'use client'

import { ScrollReveal } from '@/components/ScrollReveal'
import { SectionWrapper } from '@/components/SectionWrapper/SectionWrapper'
import { SystemCard } from '@/components/SystemCard/SystemCard'
import { MinimalButton } from '@/components/MinimalButton/MinimalButton'

const WHATSAPP_NUMBER = '' // TODO: add your WhatsApp number with country code, e.g. 521234567890

export default function ContactPage() {
  return (
    <main>
      <SectionWrapper compact className="min-h-[60vh]">
        <div className="mx-auto max-w-lg">
        <ScrollReveal>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Formulario
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contacto
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Si hay algo que quieras construir — o algo que ya no rinde como debería — cuéntalo en
            pocas líneas. Con eso alcanza para ver si tiene sentido seguir.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            No trabajo con todos los proyectos. Solo con los que tienen sentido hacer bien.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-12">
          <SystemCard>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/35"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/35"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="business" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Negocio o proyecto
                </label>
                <input
                  id="business"
                  type="text"
                  name="business"
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/35"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label htmlFor="need" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  ¿Qué está pasando?
                </label>
                <textarea
                  id="need"
                  name="need"
                  rows={4}
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/35"
                  placeholder="Idea, problema, algo roto, algo que quieres construir…"
                />
              </div>
              <MinimalButton type="submit" variant="accent" size="lg" className="w-full">
                Enviar
              </MinimalButton>
            </form>
          </SystemCard>
        </ScrollReveal>

        {WHATSAPP_NUMBER ? (
          <ScrollReveal className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">O por WhatsApp</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-85"
            >
              Abrir WhatsApp
            </a>
          </ScrollReveal>
        ) : null}

        {!WHATSAPP_NUMBER ? (
          <ScrollReveal className="mt-10 text-center text-sm text-muted-foreground">
            Si añades tu número de WhatsApp en el código, aquí aparecerá el acceso directo.
          </ScrollReveal>
        ) : null}
        </div>
      </SectionWrapper>
    </main>
  )
}
