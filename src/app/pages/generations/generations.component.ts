import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsoleService } from '../../services/console.service';
import { GameConsole, Generation } from '../../models/console.model';

interface GenGroup {
  generation: Generation;
  consoles: GameConsole[];
}

@Component({
  selector: 'app-generations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './generations.component.html',
  styleUrl: './generations.component.css',
})
export class GenerationsComponent {
  private readonly service = inject(ConsoleService);

  readonly groups: GenGroup[] = this.service.getGenerations().map((g) => ({
    generation: g,
    consoles: this.service
      .getByGeneration(g.number)
      .sort((a, b) => a.releaseYear - b.releaseYear),
  }));
}
