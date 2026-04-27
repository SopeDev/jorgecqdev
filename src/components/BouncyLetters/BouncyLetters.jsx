'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'

export function BouncyLetters({ text, className }) {
  const lettersRef = useRef([])

  const animateIn = (index) => {
    const node = lettersRef.current[index]
    if (!node) return
    gsap.killTweensOf(node)
    gsap.to(node, {
      scaleY: 1.28,
      duration: 1,
      ease: 'elastic.out(1.25, 0.28)',
    })
  }

  const animateOut = (index) => {
    const node = lettersRef.current[index]
    if (!node) return
    gsap.killTweensOf(node)
    gsap.to(node, {
      scaleY: 1,
      duration: 1,
      ease: 'elastic.out(1.35, 0.28)',
    })
  }

  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          ref={(el) => {
            lettersRef.current[index] = el
          }}
          className="inline-block origin-[center_bottom] will-change-transform"
          onMouseEnter={() => animateIn(index)}
          onMouseLeave={() => animateOut(index)}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
