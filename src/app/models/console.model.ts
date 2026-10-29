/**
 * Modelos de dominio para la enciclopedia de consolas de videojuegos.
 * Todo el contenido de datos (nombres, juegos, specs) se mantiene en inglés,
 * siguiendo la convención del proyecto; los comentarios/UI pueden ir en español.
 */

/** Tipo / estilo físico de la consola. */
export type ConsoleType =
  | 'Home' // Sobremesa
  | 'Handheld' // Portátil
  | 'Hybrid' // Híbrida (sobremesa + portátil)
  | 'Microconsole' // Microconsola
  | 'Plug-and-Play' // Plug & play / dedicada
  | 'Arcade-based' // Consola basada en hardware arcade
  | 'PC-based'; // Consola basada en arquitectura PC

/** Región principal de origen/lanzamiento. */
export type Region = 'Japan' | 'North America' | 'Europe' | 'Worldwide' | 'Other';

/**
 * Arquitectura técnica (hardware) de la consola.
 * Todos los campos son opcionales porque la información disponible
 * varía mucho entre las consolas más antiguas y las modernas.
 */
export interface Architecture {
  /** CPU principal, p.ej. "MOS 6507 @ 1.19 MHz". */
  cpu?: string;
  /** Co-procesador / unidad gráfica, p.ej. "TIA", "Reality Coprocessor". */
  gpu?: string;
  /** Chip / unidad de sonido. */
  sound?: string;
  /** Memoria RAM principal. */
  ram?: string;
  /** Memoria de vídeo (VRAM), si es independiente. */
  vram?: string;
  /** Resolución / salida de vídeo típica. */
  resolution?: string;
  /** Soporte de almacenamiento de juegos (cartucho, CD, Blu-ray, etc.). */
  media?: string;
  /** Bits "comerciales" (etiqueta de marketing de la época). */
  bits?: string;
  /** Notas técnicas adicionales. */
  notes?: string;
}

/** Un juego dentro del Top de una consola. */
export interface Game {
  /** Posición en el ranking (1 = mejor). */
  rank: number;
  /** Título del juego (en inglés / título original). */
  title: string;
  /** Año de lanzamiento en esa consola, si se conoce. */
  year?: number;
  /** Desarrollador o distribuidor principal, si se conoce. */
  developer?: string;
}

/** Una consola de videojuegos. */
export interface GameConsole {
  /** Identificador único en slug, p.ej. "nintendo-nes". */
  id: string;
  /** Nombre comercial, p.ej. "Nintendo Entertainment System (NES)". */
  name: string;
  /** Nombre abreviado, p.ej. "NES". */
  shortName?: string;
  /** Fabricante, p.ej. "Nintendo". */
  manufacturer: string;
  /** Generación (1–9). 0 para dispositivos pre-generación/experimentales. */
  generation: number;
  /** Tipo / estilo físico. */
  type: ConsoleType;
  /** Año de primer lanzamiento. */
  releaseYear: number;
  /** Año de descatalogación, si aplica. */
  discontinuedYear?: number;
  /** Región principal de lanzamiento. */
  region: Region;
  /** Unidades vendidas (texto libre, p.ej. "61.91 million"). */
  unitsSold?: string;
  /** Descripción / contexto histórico breve. */
  description: string;
  /** Arquitectura técnica. */
  architecture: Architecture;
  /** Top de juegos originales de la consola (idealmente 50). */
  topGames: Game[];
  /** Color de acento para la tarjeta (CSS). */
  accent?: string;
}

/** Metadatos de una generación de consolas. */
export interface Generation {
  number: number;
  name: string;
  years: string;
  summary: string;
}
