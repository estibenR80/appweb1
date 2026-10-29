import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsoleService } from '../../services/console.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  private readonly service = inject(ConsoleService);
  readonly brands = this.service.getBrandSummaries();
}
