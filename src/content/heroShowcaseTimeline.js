import { SHOWCASE_SLIDE_COUNT } from '@/content/showcaseProjects'

/** Session flag: Proyectos → home lands on last hero frame (scroll end). */
export const SESSION_RESTORE_HERO_END = 'jqRestoreHeroEnd'

/** Must stay aligned with HomeHero / ProyectosHero scrub math. */
export const UNITS_PER_VH = 4
export const PER_SHOWCASE_SLIDE = 5
export const SHOWCASE_WIPE_DURATION = 2
export const SHOWCASE_CLIP_VISIBLE = 'inset(0% 0% 0% 0%)'
export const SHOWCASE_CLIP_HIDDEN_RIGHT = 'inset(0% 0% 0% 100%)'
export const SHOWCASE_CARD_OFFSET_X = 10

export const projectsPhaseDuration = SHOWCASE_SLIDE_COUNT * PER_SHOWCASE_SLIDE
