import { Injectable } from '@angular/core';
import { GameConsole, Generation } from '../models/console.model';
import { ALL_CONSOLES } from '../data/consoles.index';
import { GENERATIONS } from '../data/generations.data';

export interface BrandSummary {
  manufacturer: string;
  count: number;
  firstYear: number;
  lastYear: number;
  consoles: GameConsole[];
}

@Injectable({ providedIn: 'root' })
export class ConsoleService {
  private readonly consoles: GameConsole[] = ALL_CONSOLES;
  private readonly generations: Generation[] = GENERATIONS;

  /** Todas las consolas, ordenadas por año. */
  getAll(): GameConsole[] {
    return this.consoles;
  }

  /** Una consola por su id (slug). */
  getById(id: string): GameConsole | undefined {
    return this.consoles.find((c) => c.id === id);
  }

  /** Todas las generaciones con metadatos. */
  getGenerations(): Generation[] {
    return this.generations;
  }

  /** Lista de fabricantes únicos (orden alfabético). */
  getManufacturers(): string[] {
    return [...new Set(this.consoles.map((c) => c.manufacturer))].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  /** Lista de tipos/estilos únicos presentes en el dataset. */
  getTypes(): string[] {
    return [...new Set(this.consoles.map((c) => c.type))].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  /** Resumen agrupado por marca. */
  getBrandSummaries(): BrandSummary[] {
    return this.getManufacturers()
      .map((manufacturer) => {
        const consoles = this.consoles
          .filter((c) => c.manufacturer === manufacturer)
          .sort((a, b) => a.releaseYear - b.releaseYear);
        const years = consoles.map((c) => c.releaseYear);
        return {
          manufacturer,
          count: consoles.length,
          firstYear: Math.min(...years),
          lastYear: Math.max(...years),
          consoles,
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  /** Consolas de una generación concreta. */
  getByGeneration(generation: number): GameConsole[] {
    return this.consoles.filter((c) => c.generation === generation);
  }

  /** Estadísticas globales para la portada. */
  getStats(): {
    totalConsoles: number;
    totalBrands: number;
    totalGames: number;
    yearRange: string;
  } {
    const totalGames = this.consoles.reduce(
      (acc, c) => acc + c.topGames.length,
      0,
    );
    const years = this.consoles.map((c) => c.releaseYear);
    return {
      totalConsoles: this.consoles.length,
      totalBrands: this.getManufacturers().length,
      totalGames,
      yearRange: `${Math.min(...years)}–${Math.max(...years)}`,
    };
  }
}
