'use client'

import { useSyncExternalStore } from 'react'

function subscribeReduced(cb) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getReducedSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedServerSnapshot() {
  return false
}

/** prefers-reduced-motion + optional min-width for scroll scenes. */
export function useMotionSafe() {
  const prefersReduced = useSyncExternalStore(
    subscribeReduced,
    getReducedSnapshot,
    getReducedServerSnapshot
  )
  return { prefersReduced }
}
