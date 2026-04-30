/**
 * `NEXT_PUBLIC_APP_VERSION` comes from package.json via next.config (set on each build).
 */
export function AppVersionLegend() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION
  if (!version) return null

  return (
    <p
      className="pointer-events-none fixed bottom-4 left-4 z-[60] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pl-[calc(0.25rem+env(safe-area-inset-left))] font-mono text-[0.62rem] leading-none tracking-[0.14em] text-muted-foreground"
      title={`Versión ${version}`}
    >
      {`v${version}`}
    </p>
  )
}
