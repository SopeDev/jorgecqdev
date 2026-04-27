# Global visual direction — jorgeCQ site

**Fuente de verdad** para implementación visual del sitio. Las siguientes instrucciones del proyecto deben alinearse con esto.

This is **not** a generic minimal website.

The design should feel:

- intentional  
- editorial  
- structured  
- slightly brutalist (but refined)  
- calm but sharp  

Avoid:

- generic SaaS UI  
- soft gradients everywhere  
- “friendly startup” look  
- centered everything  

---

## Color system

| Role | Value |
|------|--------|
| Background (main) | `#0B0B0C` |
| Sections / cards | `#111113` |
| Text primary | `#EAEAEA` |
| Text secondary | `#A1A1AA` |
| Accent | `#3B82F6` — **used very sparingly** |
| Borders | `rgba(255,255,255,0.08)` |

No pure `#000000` / `#FFFFFF` as default surfaces. No gradients unless explicitly justified.

Tokens viven en `src/app/globals.css` (clase `.dark` en `<html>`).

---

## Typography

- Strong hierarchy is mandatory.  
- Headings feel **editorial**, not UI labels (evitar sensación de “dashboard”).  
- Avoid perfectly centered layouts everywhere; prefer **asymmetry** and clear column logic when it fits the content.  
- Inter (o sans equivalente) como base.

---

## Spacing

- Large vertical spacing (`py-24+` entre bloques de sección).  
- Tight internal spacing dentro de tarjetas y listas.  
- Let sections breathe.

---

## Interaction

- Subtle hover only (no animation for its own sake).  
- No flashy transitions.  
- Calm and intentional; respect `prefers-reduced-motion` where hay motion.

---

## Core principle

Every section should feel like a **block of thought**, not a UI component.

---

*Alineado estratégicamente con `project-direction.md` (posicionamiento, tono, filtro).*
