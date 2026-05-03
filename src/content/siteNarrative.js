/**
 * Copy y estructura narrativa (home + satélites). Proyectos: completar contexto / sistema / resultado.
 */

export const ENFOQUE_CONTENT = {
  /** Lead column heading (enfoque section) */
  sectionLabel: 'Mi enfoque:',
  titleLead: 'No solo sitios. ',
  /** Teal accent in hero + Enfoque (display with text-primary) */
  titleAccent: 'Herramientas que trabajan para ti',
  title: 'No solo sitios. Herramientas que trabajan para ti.',
  lines: [
    'No se trata solo de tener presencia en Internet. Se trata de construir herramientas que realmente aporten valor a tu negocio.',
    'Cada proyecto lo abordo con una visión clara: que lo que construyamos funcione hoy, pero también tenga espacio para crecer.',
  ],
}

export const WHAT_I_DO_BLOCKS = [
  {
    title: 'Sitios web con propósito claro',
    situation:
      'Necesitas presencia en línea, pero lo que importa es el mensaje, el recorrido y qué debe pasar después.',
    build:
      'Estructura, flujo y foco en conversión — no plantilla vacía ni “solo verse bien”.',
    outcome: 'Un sitio con intención clara que sostiene el negocio, no solo lo decora.',
    systemsGrid: { tone: 'panel', spacing: 'tight' },
  },
  {
    title: 'Aplicaciones web',
    situation:
      'Tu equipo o tu operación necesita herramientas internas, paneles o plataformas que la gente use de verdad.',
    build:
      'Dashboards, flujos internos, software operativo. Si se puede definir cómo se usa, se puede construir.',
    outcome: 'Algo sólido para el día a día, no un prototipo abandonado.',
    systemsGrid: { tone: 'standard', spacing: 'airy' },
  },
  {
    title: 'Sistemas a medida',
    situation: 'No existe una herramienta que encaje: el flujo es tuyo y hay que diseñarlo desde cero.',
    build: 'Definir el sistema (qué entra, qué no, quién hace qué) y construirlo con esa lógica.',
    outcome: 'Una base que puedas mantener y extender cuando tenga sentido.',
    systemsGrid: { tone: 'inset', spacing: 'airy', emphasis: true },
  },
  {
    title: 'Optimización y reestructura',
    situation:
      'Ya hay algo hecho — sitio, app o flujo — pero no rinde, está roto o nadie sabe cómo usarlo.',
    build: 'Revisar qué falla, quitar lo que sobra y rehacer lo necesario con criterio.',
    outcome: 'Menos parches, más claridad y algo que vuelva a ser confiable.',
    systemsGrid: { tone: 'standard', spacing: 'tight' },
  },
]

export const HOW_I_WORK_PHASES = [
  {
    title: 'Entender',
    body: 'Qué problema estamos resolviendo en realidad — no solo qué pantalla pidió alguien.',
  },
  {
    title: 'Estructurar',
    body: 'Ordenar la lógica, alcance y prioridades antes de escribir código a ciegas.',
  },
  {
    title: 'Construir',
    body: 'Desarrollar algo sólido y revisable, no improvisación encadenada.',
  },
  {
    title: 'Ajustar',
    body: 'Refinar con uso real hasta que funcione como debe, sin prometer magia instantánea.',
  },
]

/** Proyecto real | concepto/demo — siempre etiquetado. */
export const FEATURED_PROJECTS = [
  {
    slug: 'stemcell',
    title: 'stemcell.mx',
    kind: 'real',
    url: 'https://stemcell.mx',
    context: 'Por definir: negocio u operación que motivó el proyecto.',
    system: 'Por definir: qué se construyó y qué rol cumple en el conjunto.',
    result: 'Por definir: resultado observable.',
  },
  {
    slug: 'chipxy',
    title: 'chipxyjewelry.com',
    kind: 'real',
    url: 'https://chipxyjewelry.com',
    context: 'Por definir: negocio u operación que motivó el proyecto.',
    system: 'Por definir: qué se construyó y qué rol cumple en el conjunto.',
    result: 'Por definir: resultado observable.',
  },
  {
    slug: 'ferquintero',
    title: 'ferquintero.com',
    kind: 'real',
    url: 'https://ferquintero.com',
    context: 'Por definir: negocio u operación que motivó el proyecto.',
    system: 'Por definir: qué se construyó y qué rol cumple en el conjunto.',
    result: 'Por definir: resultado observable.',
  },
  {
    slug: 'demo-dashboard',
    title: 'Panel de administración (concepto)',
    kind: 'concept',
    url: null,
    context: 'Demo: flujos internos y gestión de datos, sin cliente en producción.',
    system: 'Exploración de UI y lógica de panel.',
    result: 'Referencia de cómo ordenar operación en pantallas concretas.',
  },
  {
    slug: 'demo-reservas',
    title: 'App de reservas (concepto)',
    kind: 'concept',
    url: null,
    context: 'Demo: reservas y calendario para servicios.',
    system: 'Flujo de usuario y estados; marcado explícitamente como concepto.',
    result: 'Ejemplo de aterrizaje de un caso típico.',
  },
  {
    slug: 'demo-mobile-ui',
    title: 'UI app móvil (concepto)',
    kind: 'concept',
    url: null,
    context: 'Demo: interacción y pantallas móviles.',
    system: 'Prototipo de interfaz, no sustituye un proyecto real cerrado.',
    result: 'Complemento junto a casos reales, siempre como demo.',
  },
]

export const IDEAL_CLIENT_POINTS = [
  'Tienes algo en movimiento — negocio, idea u operación — y quieres ordenarlo y llevarlo a algo que funcione.',
  'Aceptas recortar lo innecesario y priorizar antes de acumular funciones.',
  'Te importa que lo digital aguante el uso real, no solo el lanzamiento.',
]

export const NOT_IDEAL_CLIENT_POINTS = [
  'Solo buscas una página “bonita” sin propósito claro ni vínculo con lo que haces.',
  'Prioridad absoluta: lo más barato y rápido posible, sin definir qué problema resolvemos.',
  'No hay margen para preguntas incómodas ni para ajustar cuando el encaje no es el adecuado.',
]

/** Profundización: mismo criterio que en inicio, con otro nivel de detalle. */
export const SERVICES_DEEP = [
  {
    title: 'Sitios web con propósito claro',
    description:
      'Arquitectura de contenido, jerarquía, llamados a la acción y rendimiento. Pensado para quien ya visita y para qué debe pasar después.',
  },
  {
    title: 'Aplicaciones web',
    description:
      'Herramientas internas, paneles, flujos con roles y estados. Enfoque en uso diario y mantenimiento razonable.',
  },
  {
    title: 'Sistemas a medida',
    description:
      'Cuando el flujo no encaja en un SaaS genérico: modelar el problema, acotar alcance y construir con esa lógica.',
  },
  {
    title: 'Optimización y reestructura',
    description:
      'Auditoría honesta de lo existente: qué conservar, qué reescribir y por qué — sin rehacer todo por moda.',
  },
]
