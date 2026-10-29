import { GameConsole } from '../models/console.model';
import { NINTENDO_CONSOLES } from './consoles/nintendo.data';
import { SEGA_CONSOLES } from './consoles/sega.data';
import { SONY_CONSOLES } from './consoles/sony.data';
import { MICROSOFT_CONSOLES } from './consoles/microsoft.data';
import { ATARI_CONSOLES } from './consoles/atari.data';
import { OTHER_CONSOLES } from './consoles/others.data';

/**
 * Índice central: une los datasets de todos los fabricantes en una sola
 * colección ordenada por año de lanzamiento.
 */
export const ALL_CONSOLES: GameConsole[] = [
  ...NINTENDO_CONSOLES,
  ...SEGA_CONSOLES,
  ...SONY_CONSOLES,
  ...MICROSOFT_CONSOLES,
  ...ATARI_CONSOLES,
  ...OTHER_CONSOLES,
].sort((a, b) => a.releaseYear - b.releaseYear);
