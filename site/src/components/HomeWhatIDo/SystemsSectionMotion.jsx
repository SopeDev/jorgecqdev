'use client'

import { useRef } from 'react'

/** Root for systems section GSAP (bus line + cards); animations wired in phase-4 module. */
export function SystemsSectionMotion({ children }) {
  const rootRef = useRef(null)
  return (
    <div ref={rootRef} data-systems-root>
      {children}
    </div>
  )
}
