import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsoleService } from '../../services/console.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly service = inject(ConsoleService);

  readonly stats = this.service.getStats();
  readonly generations = this.service.getGenerations();

  /** Consolas destacadas para la portada (una muestra icónica). */
  readonly featured = this.service
    .getAll()
    .filter((c) =>
      [
        'atari-2600',
        'nintendo-nes',
        'sega-genesis',
        'nintendo-snes',
        'sony-playstation',
        'sega-dreamcast',
        'sony-ps2',
        'nintendo-wii',
        'microsoft-xbox-360',
        'nintendo-switch',
        'sony-ps5',
        'microsoft-xbox-series',
      ].includes(c.id),
    );

  consolesInGen(n: number): number {
    return this.service.getByGeneration(n).length;
  }
}
