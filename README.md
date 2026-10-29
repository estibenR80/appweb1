# 🎮 RetroConsolas

**Enciclopedia de la historia de las consolas de videojuegos** — todas las marcas, estilos, modelos y arquitecturas, desde la Magnavox Odyssey (1972) hasta la generación actual. Cada consola incluye su **ficha técnica (arquitectura)** y un **Top de juegos originales** (hasta 50 por consola).

Aplicación hecha con **Angular 18** (standalone components + signals + lazy routing).

---

## 📊 Contenido del catálogo

- **60 consolas** de **13 fabricantes** (Nintendo, Sega, Sony, Microsoft, Atari, NEC, SNK, Magnavox, Coleco, Mattel, GCE, Fairchild, Philips, Bandai, Commodore, Panasonic/3DO, Ouya, Nokia…).
- **1.878 juegos** catalogados en los rankings de las consolas.
- **9 generaciones** documentadas, de la 1ª (consolas dedicadas) a la 9ª (PS5 / Xbox Series).
- Datos de arquitectura: CPU, GPU, sonido, RAM/VRAM, resolución, soporte y "bits".

> Nota sobre el alcance: las consolas con catálogo amplio incluyen un **Top 50**. Las consolas con catálogo reducido (Virtual Boy, Jaguar, 32X, PC-FX, etc.) incluyen un **Top honesto** con solo los juegos reales relevantes, sin rellenar con títulos inventados.

---

## 🚀 Puesta en marcha

Requisitos: **Node.js 18+** y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Servir en modo desarrollo (http://localhost:4200)
npm start

# 3. Compilar para producción
npm run build
```

---

## 🗂️ Estructura del proyecto

```
src/
├── index.html
├── main.ts
├── styles.css                       # Tema global oscuro "retro-gamer"
└── app/
    ├── app.component.ts             # Layout: cabecera, nav y footer
    ├── app.config.ts                # Config de la app (router, scrolling)
    ├── app.routes.ts                # Rutas con lazy loading
    ├── models/
    │   └── console.model.ts         # Tipos: GameConsole, Architecture, Game, Generation
    ├── services/
    │   └── console.service.ts       # Acceso a datos, filtros y estadísticas
    ├── data/
    │   ├── generations.data.ts      # Metadatos de las 9 generaciones
    │   ├── consoles.index.ts        # Une todos los datasets (ordenados por año)
    │   └── consoles/
    │       ├── nintendo.data.ts     # 14 consolas
    │       ├── sega.data.ts         # 10 consolas
    │       ├── sony.data.ts         #  8 consolas
    │       ├── microsoft.data.ts    #  4 consolas
    │       ├── atari.data.ts        #  6 consolas
    │       └── others.data.ts       # 18 consolas (NEC, SNK, Magnavox, 3DO…)
    └── pages/
        ├── home/                    # Portada: stats + destacadas + timeline
        ├── catalog/                 # Catálogo con filtros (marca, generación, tipo)
        ├── console-detail/          # Ficha: arquitectura + Top de juegos
        ├── brands/                  # Agrupado por fabricante
        └── generations/             # Agrupado por generación
```

---

## 🧭 Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Portada con estadísticas, consolas emblemáticas y línea de tiempo. |
| `/consolas` | Catálogo completo con buscador y filtros por marca, generación, tipo y orden. |
| `/consolas/:id` | Ficha de una consola: ficha general, arquitectura técnica y Top de juegos. |
| `/marcas` | Fabricantes con todas sus consolas. |
| `/generaciones` | Las 9 generaciones con sus consolas. |

---

## 🛠️ Cómo ampliar los datos

Para añadir una consola, edita el archivo del fabricante en `src/app/data/consoles/` (o crea uno nuevo e impórtalo en `consoles.index.ts`). Cada entrada sigue la interfaz `GameConsole` de `src/app/models/console.model.ts`.

---

## 📄 Licencia y marcas

Proyecto educativo. Los nombres de consolas y juegos son marcas registradas de sus respectivos propietarios y se usan aquí con fines informativos.
