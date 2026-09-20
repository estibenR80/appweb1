# ProduTech S.A. — Aplicativo Web de Gestión de Producción

Prototipo funcional del sistema web descrito en el **estudio de caso** de la asignatura
*Programación con lenguajes de guion en páginas web*. Materializa en código las
tecnologías y objetivos planteados en el documento: HTML5, CSS3 y JavaScript del lado
del cliente, con persistencia en `localStorage` que simula la base de datos.

---

## 🎯 Relación con el estudio de caso

| Elemento del estudio de caso | Cómo se implementa en el prototipo |
|---|---|
| **Objeto de estudio:** optimizar procesos de producción | Módulos de órdenes de producción e inventario centralizados |
| **Objetivo 1:** reducir tiempos, mejorar planificación y control de inventarios | Panel de control con KPIs, avance de estado de órdenes y alertas de stock |
| **Objetivo 2:** usabilidad y experiencia de usuario | Interfaz limpia, responsive, navegación por secciones, notificaciones (toast) |
| **Actores:** empleados y personal administrativo | Login con **dos roles**; el operario no ve acciones exclusivas de administración |
| **Frontend (HTML/CSS/JS):** | `index.html`, `css/styles.css`, `js/app.js` |
| **Backend/BD (simulado):** | `js/data.js` + `localStorage` (capa de datos `DB`) |
| **Herramienta seleccionada:** Visual Studio Code | Proyecto editable y ejecutable directamente en VS Code |

---

## 🗂️ Estructura del proyecto

```
produtech-app/
├── index.html          # Estructura: login + aplicación (SPA)
├── css/
│   └── styles.css      # Estilos corporativos, responsive
├── js/
│   ├── data.js         # Datos de ejemplo + capa de acceso (DB) con localStorage
│   └── app.js          # Lógica: login, navegación, CRUD, dashboard, reportes
└── README.md
```

## ✨ Funcionalidades

- **Autenticación por rol** (administrativo / operario) con control de permisos.
- **Panel de control (dashboard):** KPIs de órdenes, barras de estado y alertas de inventario bajo mínimo.
- **Órdenes de producción:** crear, buscar, avanzar estado (Pendiente → En proceso → Completada) y eliminar.
- **Inventario:** crear materiales, ajustar stock (＋/－), detectar niveles críticos y eliminar.
- **Reportes:** unidades planificadas vs. completadas, % de cumplimiento y producción por producto.
- **Persistencia:** los cambios se guardan en el navegador (`localStorage`).

## 🔑 Credenciales de prueba

| Rol | Usuario | Contraseña |
|---|---|---|
| Personal administrativo | `admin` | `1234` |
| Empleado (producción) | `operario` | `1234` |

> El operario tiene una vista simplificada: no puede crear/eliminar materiales,
> eliminar órdenes ni ver el módulo de reportes (elementos marcados como *admin-only*).

## ▶️ Cómo ejecutarlo

**Opción 1 — Abrir directamente:** haz doble clic en `index.html` (funciona sin servidor).

**Opción 2 — En Visual Studio Code (recomendado):**
1. Abre la carpeta `produtech-app` en VS Code.
2. Instala la extensión **Live Server**.
3. Clic derecho sobre `index.html` → *Open with Live Server*.

**Opción 3 — Servidor local con Node o Python:**
```bash
# Python
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## 🛠️ Tecnologías

- **HTML5** — estructura semántica.
- **CSS3** — variables, flexbox, grid, diseño responsive.
- **JavaScript (ES6+)** — sin frameworks ni dependencias externas.
- **localStorage** — persistencia del lado del cliente (simula la base de datos).

## 🚀 Posible evolución (según el estudio de caso)

- Reemplazar `localStorage` por un **backend real** (Node.js/Express o Java con NetBeans) y una base de datos **MySQL/PostgreSQL**.
- Autenticación con contraseñas cifradas y **HTTPS**.
- Reportes gráficos con librerías de visualización y exportación a PDF.
