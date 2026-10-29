import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConsoleService } from '../../services/console.service';
import { GameConsole } from '../../models/console.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  private readonly service = inject(ConsoleService);

  readonly manufacturers = this.service.getManufacturers();
  readonly generations = this.service.getGenerations();
  readonly types = this.service.getTypes();

  readonly search = signal('');
  readonly brand = signal('');
  readonly generation = signal('');
  readonly type = signal('');
  readonly sort = signal<'year-asc' | 'year-desc' | 'name' | 'games'>('year-asc');

  private readonly all = this.service.getAll();

  readonly filtered = computed<GameConsole[]>(() => {
    const q = this.search().trim().toLowerCase();
    const brand = this.brand();
    const gen = this.generation();
    const type = this.type();

    let list = this.all.filter((c) => {
      if (brand && c.manufacturer !== brand) return false;
      if (gen && c.generation !== Number(gen)) return false;
      if (type && c.type !== type) return false;
      if (q) {
        const haystack = `${c.name} ${c.manufacturer} ${c.shortName ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sort = this.sort();
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'year-desc':
          return b.releaseYear - a.releaseYear;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'games':
          return b.topGames.length - a.topGames.length;
        default:
          return a.releaseYear - b.releaseYear;
      }
    });
    return list;
  });

  resetFilters(): void {
    this.search.set('');
    this.brand.set('');
    this.generation.set('');
    this.type.set('');
    this.sort.set('year-asc');
  }
}
