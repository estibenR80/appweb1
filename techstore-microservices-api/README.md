# TechStore — API de Tienda Online con Microservicios

Prototipo semifuncional de una API para una tienda online (**TechStore**) construida con una
**arquitectura de microservicios**. Implementa operaciones CRUD vinculadas a una base de datos,
autenticación con JWT, catálogo de productos, inventario, carrito de compras, pasarela de pago
(simulada) y envíos.

> Taller Semana 8 — Ingeniería Web — UNIMINUTO.
> Aplicación de los atributos de calidad en la arquitectura de software.

---

## 1. Arquitectura

El sistema se compone de un **API Gateway** y cuatro **microservicios** de dominio, más una capa
de **acceso a datos** compartida que abstrae la base de datos (SQLite).

```
                           ┌──────────────────────┐
         Cliente  ───────▶ │   API Gateway (8080) │  (Servicio de API)
                           │  - Enrutamiento      │
                           │  - Verificación JWT  │
                           │  - Rate limiting      │
                           └──────────┬───────────┘
            ┌─────────────────┬───────┼────────────────┬──────────────────┐
            ▼                 ▼        ▼                ▼                  ▼
   ┌────────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐ ┌───────────────┐
   │ Auth Service   │ │ Catalog Svc  │ │ Cart Svc    │ │ Payment Svc  │ │ Shipping Svc  │
   │   (3001)       │ │   (3002)     │ │   (3003)    │ │   (3004)     │ │   (3005)      │
   │ usuarios/login │ │ productos +  │ │ carrito +   │ │ pagos        │ │ envíos        │
   │ JWT            │ │ inventario   │ │ checkout    │ │ (simulada)   │ │               │
   └───────┬────────┘ └──────┬───────┘ └──────┬──────┘ └──────┬───────┘ └───────┬───────┘
           └─────────────────┴────────────────┴───────────────┴─────────────────┘
                                          │
                              ┌───────────▼────────────┐
                              │  Servicio de Datos       │
                              │  (capa compartida /db)   │
                              │  SQLite (better-sqlite3) │
                              └──────────────────────────┘
```

Cada microservicio:
- Es un proceso independiente con su propio `package.json` y puerto.
- Expone sus endpoints CRUD y un `/health` y `/metrics`.
- Usa la **capa de datos compartida** (`shared/`) que abstrae el acceso a SQLite
  (Servicio de base de datos).
- Separa responsabilidades en capas: `routes` → `controllers` → `services` → `repositories`.

## 2. Stack tecnológico

| Aspecto | Tecnología |
|---|---|
| Lenguaje / runtime | Node.js 22 |
| Framework HTTP | Express |
| Base de datos | SQLite (`better-sqlite3`) |
| Autenticación | JWT (`jsonwebtoken`) + hashing `bcryptjs` |
| Validación | `zod` |
| Logs | `winston` (JSON estructurado) |
| Métricas | `prom-client` (formato Prometheus) |
| Tests | `jest` + `supertest` |
| Documentación API | OpenAPI 3 (`swagger-ui-express`) |
| Despliegue (staging) | Docker + Docker Compose |

## 3. Estructura del repositorio

```
.
├── docker-compose.yml          # Entorno de staging (todos los servicios)
├── package.json                # Workspaces + scripts raíz
├── shared/                     # Capa de datos + utilidades comunes
│   ├── db.js                   # Servicio de base de datos (SQLite)
│   ├── logger.js               # Logging estructurado
│   ├── metrics.js              # Métricas Prometheus
│   ├── auth.js                 # Verificación de JWT
│   └── httpClient.js           # Cliente HTTP entre servicios
├── services/
│   ├── auth/                   # Servicio de autenticación
│   ├── catalog/                # Catálogo + inventario
│   ├── cart/                   # Carrito + checkout
│   ├── payment/                # Pasarela de pago (simulada)
│   └── shipping/               # Envíos
├── gateway/                    # API Gateway (Servicio de API)
├── openapi/
│   └── techstore.yaml          # Contrato de la API (API definition)
└── tests/                      # Tests automatizados (Jest + Supertest)
```

## 4. Cómo ejecutar

### Opción A — local (un solo proceso con todos los servicios montados)

```bash
npm install
npm run seed       # crea y puebla la base de datos
npm start          # levanta el gateway + microservicios
```

### Opción B — Docker Compose (staging)

```bash
docker compose up --build
```

El gateway queda en `http://localhost:8080`.
La documentación interactiva en `http://localhost:8080/docs`.

## 5. Tests

```bash
npm test
```

Cubre la lógica de negocio (servicios) y los endpoints de la API (Supertest).

## 6. Endpoints principales (vía Gateway)

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario | No |
| POST | `/api/auth/login` | Devuelve un JWT | No |
| GET | `/api/products` | Lista el catálogo | No |
| GET | `/api/products/:id` | Detalle de producto | No |
| POST | `/api/products` | Crea producto | Admin |
| PUT | `/api/products/:id` | Actualiza producto | Admin |
| DELETE | `/api/products/:id` | Elimina producto | Admin |
| GET | `/api/cart` | Ver carrito | Usuario |
| POST | `/api/cart/items` | Agregar ítem | Usuario |
| DELETE | `/api/cart/items/:id` | Quitar ítem | Usuario |
| POST | `/api/cart/checkout` | Confirmar compra (pago + envío) | Usuario |
| GET | `/api/shipping/:orderId` | Estado del envío | Usuario |

Ver el contrato completo en `openapi/techstore.yaml`.
