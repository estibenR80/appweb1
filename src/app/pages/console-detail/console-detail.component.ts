import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ConsoleService } from '../../services/console.service';
import { Architecture } from '../../models/console.model';

interface SpecRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-console-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './console-detail.component.html',
  styleUrl: './console-detail.component.css',
})
export class ConsoleDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ConsoleService);

  private readonly id = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly console = computed(() => this.service.getById(this.id()));

  readonly specs = computed<SpecRow[]>(() => {
    const c = this.console();
    if (!c) return [];
    const a: Architecture = c.architecture;
    const rows: SpecRow[] = [];
    const push = (label: string, value?: string) => {
      if (value) rows.push({ label, value });
    };
    push('CPU', a.cpu);
    push('GPU / Vídeo', a.gpu);
    push('Sonido', a.sound);
    push('RAM', a.ram);
    push('VRAM', a.vram);
    push('Resolución', a.resolution);
    push('Soporte', a.media);
    push('Bits', a.bits);
    push('Notas', a.notes);
    return rows;
  });

  readonly meta = computed<SpecRow[]>(() => {
    const c = this.console();
    if (!c) return [];
    const rows: SpecRow[] = [
      { label: 'Fabricante', value: c.manufacturer },
      { label: 'Generación', value: `${c.generation}ª` },
      { label: 'Tipo', value: c.type },
      { label: 'Región', value: c.region },
      {
        label: 'Lanzamiento',
        value: c.discontinuedYear
          ? `${c.releaseYear}–${c.discontinuedYear}`
          : `${c.releaseYear}`,
      },
    ];
    if (c.unitsSold) rows.push({ label: 'Unidades vendidas', value: c.unitsSold });
    return rows;
  });
}
