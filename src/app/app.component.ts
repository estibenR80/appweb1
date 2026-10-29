import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="container header-inner">
        <a routerLink="/" class="logo">
          <span class="logo-mark">▶</span>
          <span class="logo-text">RetroConsolas</span>
        </a>
        <nav class="main-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
          <a routerLink="/consolas" routerLinkActive="active">Catálogo</a>
          <a routerLink="/marcas" routerLinkActive="active">Marcas</a>
          <a routerLink="/generaciones" routerLinkActive="active">Generaciones</a>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>
          <strong>RetroConsolas</strong> — Enciclopedia de la historia de las
          consolas de videojuegos: todas las marcas, estilos, modelos y
          arquitecturas.
        </p>
        <p class="muted">
          Proyecto educativo hecho con Angular. Los nombres de consolas y juegos
          son marcas de sus respectivos propietarios.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      .site-header {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(15, 16, 28, 0.85);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
      }
      .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        text-decoration: none;
        color: var(--text);
      }
      .logo-mark {
        color: var(--accent);
        font-size: 1.3rem;
      }
      .logo-text {
        font-family: 'Press Start 2P', monospace;
        font-size: 0.95rem;
        letter-spacing: 0.5px;
      }
      .main-nav {
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
      }
      .main-nav a {
        color: var(--text-dim);
        text-decoration: none;
        padding: 0.45rem 0.85rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: background 0.15s, color 0.15s;
      }
      .main-nav a:hover {
        color: var(--text);
        background: var(--surface-2);
      }
      .main-nav a.active {
        color: #fff;
        background: var(--accent);
      }
      .site-footer {
        margin-top: 4rem;
        padding: 2rem 0;
        border-top: 1px solid var(--border);
        color: var(--text-dim);
        font-size: 0.9rem;
      }
      .site-footer .muted {
        color: #6b6f85;
        font-size: 0.82rem;
      }
      @media (max-width: 560px) {
        .logo-text {
          font-size: 0.7rem;
        }
        .main-nav a {
          padding: 0.4rem 0.55rem;
          font-size: 0.85rem;
        }
      }
    `,
  ],
})
export class AppComponent {}
