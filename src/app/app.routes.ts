import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'RetroConsolas · Inicio',
  },
  {
    path: 'consolas',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then(
        (m) => m.CatalogComponent,
      ),
    title: 'Catálogo de consolas',
  },
  {
    path: 'consolas/:id',
    loadComponent: () =>
      import('./pages/console-detail/console-detail.component').then(
        (m) => m.ConsoleDetailComponent,
      ),
    title: 'Ficha de consola',
  },
  {
    path: 'marcas',
    loadComponent: () =>
      import('./pages/brands/brands.component').then((m) => m.BrandsComponent),
    title: 'Marcas / fabricantes',
  },
  {
    path: 'generaciones',
    loadComponent: () =>
      import('./pages/generations/generations.component').then(
        (m) => m.GenerationsComponent,
      ),
    title: 'Generaciones',
  },
  { path: '**', redirectTo: '' },
];
