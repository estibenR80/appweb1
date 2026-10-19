<!--
  DOCUMENTO TÉCNICO — TALLER SEMANA 8
  Este archivo está escrito en Markdown para que pueda convertirse fácilmente a
  Word (.docx) o PDF. Al final del documento se incluyen instrucciones de conversión.
-->

<div align="center">

# CORPORACIÓN UNIVERSITARIA MINUTO DE DIOS — UNIMINUTO

<br/>

## Diseño e implementación de una API con arquitectura de microservicios para una tienda online: aplicación de atributos de calidad en la arquitectura de software

<br/><br/>

**Documento técnico — Taller Semana 8**

<br/>

**Autor:** Estibin Rodriguez

**Curso:** Programación Avanzada

**Docente:** Docente de Programación Avanzada

**Fecha de entrega:** 18 de octubre de 2026

</div>

<div style="page-break-after: always;"></div>

---

## Índice

1. Introducción
   1.1. Problemática
   1.2. Objetivo general
   1.3. Objetivos específicos
2. Planeación
   2.1. Requisitos funcionales
   2.2. Requisitos no funcionales (atributos de calidad)
   2.3. Plan de trabajo y actividades
   2.4. Stack tecnológico
3. Desarrollo
   3.1. Arquitectura de microservicios
   3.2. Servicio de API (API Gateway)
   3.3. Servicio de lógica de negocio
   3.4. Servicio de base de datos
   3.5. Servicio de autenticación
   3.6. Base de datos implementada
   3.7. Contratos de la API (API definitions)
   3.8. Buenas prácticas de implementación
   3.9. Tests automatizados
   3.10. Despliegue en entorno de staging
   3.11. Monitoreo y observabilidad
   3.12. Documentación de la API para desarrolladores
4. Resultados
5. Conclusiones
6. Referencias

<div style="page-break-after: always;"></div>

---

## 1. Introducción

### 1.1. Problemática

El comercio electrónico exige plataformas capaces de crecer, mantenerse y evolucionar sin comprometer la experiencia del usuario ni la estabilidad del sistema. Las aplicaciones construidas como un único bloque (arquitectura monolítica) suelen volverse difíciles de escalar y mantener: un cambio en un módulo obliga a desplegar toda la aplicación y un fallo puede afectar a todo el sistema.

El problema planteado en este taller consiste en **codificar una API que vincule operaciones CRUD a una base de datos usando una arquitectura de microservicios** para una tienda online que requiere carrito de compras, catálogo de productos, pasarela de pago, inventario y envíos. La solución debe aplicar de forma explícita los **atributos de calidad** del software (escalabilidad, mantenibilidad, rendimiento, seguridad, fiabilidad, etc.) en el diseño de la arquitectura.

### 1.2. Objetivo general

Diseñar e implementar un prototipo semifuncional de API basada en microservicios para una tienda online (**TechStore**), que incorpore operaciones CRUD sobre una base de datos, autenticación, y la orquestación de catálogo, inventario, carrito, pagos y envíos, aplicando buenas prácticas y atributos de calidad de la arquitectura de software.

### 1.3. Objetivos específicos

- Definir los requisitos funcionales y no funcionales de la API.
- Diseñar una arquitectura de microservicios con separación de responsabilidades.
- Implementar los microservicios (API Gateway, autenticación, catálogo/inventario, carrito, pagos y envíos) y la base de datos.
- Definir los contratos de la API mediante OpenAPI.
- Implementar tests automatizados para la lógica de negocio y los endpoints.
- Preparar el despliegue en un entorno de staging con Docker.
- Incorporar observabilidad (logs, métricas) y documentación para desarrolladores.

<div style="page-break-after: always;"></div>

---

## 2. Planeación

### 2.1. Requisitos funcionales

| ID | Requisito | Operación CRUD |
|----|-----------|----------------|
| RF-01 | Registrar usuarios y autenticarlos | Create / Read |
| RF-02 | Emitir y validar tokens JWT | — |
| RF-03 | Gestionar el catálogo de productos (crear, consultar, actualizar, eliminar) | CRUD completo |
| RF-04 | Controlar el inventario (stock) de los productos | Update (decremento) |
| RF-05 | Gestionar el carrito de compras (agregar, consultar, eliminar ítems) | CRUD parcial |
| RF-06 | Procesar el checkout: reservar stock, cobrar y generar envío | Create |
| RF-07 | Procesar pagos a través de una pasarela (simulada) | Create / Read |
| RF-08 | Generar y consultar envíos con número de rastreo | Create / Read |
| RF-09 | Restringir operaciones de escritura del catálogo a administradores | — |

### 2.2. Requisitos no funcionales (atributos de calidad)

La arquitectura se diseñó aplicando los atributos de calidad descritos por Ingeno (2018), que constituyen los **requisitos no funcionales** del sistema:

| Atributo de calidad | Cómo se aborda en la solución |
|---------------------|-------------------------------|
| **Escalabilidad** | Cada microservicio es independiente y puede escalar horizontalmente por separado (p. ej., más instancias de catálogo en campañas). |
| **Mantenibilidad** | Separación de responsabilidades en capas (routes → controllers → services → repositories) y bajo acoplamiento entre servicios. |
| **Rendimiento** | Base de datos con índices (claves únicas), consultas parametrizadas, histograma de latencia por endpoint. |
| **Seguridad** | Autenticación con JWT, hashing de contraseñas con bcrypt, autorización por rol, rate limiting en el gateway, validación de entradas con Zod. |
| **Fiabilidad / disponibilidad** | Manejo de errores centralizado, health checks por servicio, descuento de stock atómico para evitar sobreventa. |
| **Observabilidad** | Logs estructurados en JSON (Winston) y métricas en formato Prometheus (prom-client). |
| **Portabilidad** | Contenerización con Docker; configuración por variables de entorno (12-factor). |
| **Testabilidad** | Lógica de negocio desacoplada de la infraestructura, con tests unitarios y de integración. |

### 2.3. Plan de trabajo y actividades

El proyecto se desarrolló en siete fases:

1. **Análisis:** definición de requisitos funcionales y no funcionales.
2. **Diseño:** arquitectura de microservicios, modelo de datos y contratos de API.
3. **Implementación de la capa de datos:** servicio de base de datos compartido (SQLite) con su esquema.
4. **Implementación de los microservicios:** autenticación, catálogo/inventario, carrito, pagos y envíos.
5. **Implementación del API Gateway:** enrutamiento, seguridad y documentación.
6. **Pruebas:** tests unitarios (lógica de negocio) y de integración (endpoints y checkout).
7. **Despliegue y observabilidad:** Docker Compose para staging, logs y métricas.

### 2.4. Stack tecnológico

| Aspecto | Tecnología | Justificación |
|---------|-----------|---------------|
| Lenguaje / runtime | Node.js 22 | Ecosistema maduro, no bloqueante, ideal para APIs de I/O intensivo. |
| Framework HTTP | Express | Minimalista, ampliamente adoptado, fácil de modularizar. |
| Base de datos | SQLite (`better-sqlite3`) | Persistencia sin servidor externo; apropiada para un prototipo; abstraída por el servicio de datos. |
| Autenticación | JWT + bcrypt | Estándar de la industria para autenticación sin estado. |
| Validación | Zod | Validación declarativa de esquemas de entrada. |
| Logs | Winston | Logs estructurados en JSON. |
| Métricas | prom-client | Exposición de métricas en formato Prometheus. |
| Tests | Jest + Supertest | Pruebas unitarias y de endpoints HTTP. |
| Documentación | OpenAPI 3 + Swagger UI | Contrato formal e interactivo de la API. |
| Despliegue | Docker + Docker Compose | Entorno reproducible de staging. |

<div style="page-break-after: always;"></div>

---

## 3. Desarrollo

### 3.1. Arquitectura de microservicios

La solución se compone de un **API Gateway** (punto único de entrada) y cinco **microservicios** de dominio, apoyados por una **capa de datos compartida** que abstrae la base de datos. Cada microservicio es un proceso independiente, con su propio puerto, endpoints `/health` y `/metrics`, y comunicación mediante HTTP/JSON.

```
                           ┌──────────────────────┐
         Cliente  ───────▶ │  API Gateway (8080)  │  (Servicio de API)
                           │  Enrutamiento, JWT,  │
                           │  rate limiting, docs │
                           └──────────┬───────────┘
        ┌─────────────┬───────────────┼────────────────┬──────────────────┐
        ▼             ▼               ▼                ▼                  ▼
 ┌────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐ ┌───────────────┐
 │ Auth (3001)│ │ Catalog(3002)│ │ Cart (3003) │ │ Payment(3004)│ │ Shipping(3005)│
 │ usuarios/  │ │ productos +  │ │ carrito +   │ │ pasarela de  │ │ envíos        │
 │ login/JWT  │ │ inventario   │ │ checkout    │ │ pago (sim.)  │ │               │
 └──────┬─────┘ └──────┬───────┘ └──────┬──────┘ └──────┬───────┘ └───────┬───────┘
        └──────────────┴────────────────┴───────────────┴─────────────────┘
                                     │
                       ┌─────────────▼──────────────┐
                       │  Servicio de base de datos  │
                       │  (capa /shared · SQLite)    │
                       └─────────────────────────────┘
```

El microservicio de **carrito** actúa como **orquestador** del proceso de compra (checkout): coordina la reserva de stock en el catálogo, el cobro en el servicio de pagos y la generación del envío, ilustrando la comunicación entre servicios.

### 3.2. Servicio de API (API Gateway)

El gateway (`gateway/src/server.js`) es el único punto expuesto al cliente. Sus responsabilidades:

- **Enrutamiento** de `/api/<servicio>` hacia el microservicio correspondiente (http-proxy-middleware).
- **Rate limiting** (300 req/min) para proteger la API.
- **Documentación interactiva** en `/docs` (Swagger UI a partir del contrato OpenAPI).
- **Health y métricas** centralizados.

Esto desacopla a los clientes de la topología interna: pueden agregarse o reubicarse servicios sin cambiar el contrato externo.

### 3.3. Servicio de lógica de negocio

Cada microservicio implementa su lógica de negocio en una capa `service.js` separada de las rutas HTTP y del acceso a datos. Por ejemplo, el servicio de carrito valida la entrada, consulta el catálogo, crea el pedido, procesa el pago y genera el envío, y solo entonces cierra el carrito. Esta separación facilita las pruebas y el mantenimiento.

Fragmento ilustrativo de la orquestación del checkout (`services/cart/src/service.js`):

```js
// 1) Reserva de stock en el servicio de catálogo/inventario.
await catalogClient.post('/internal/reserve-stock', { items });
// 2) Crea el pedido.
const order = repo.createOrder({ userId, cartId, totalCents });
// 3) Procesa el pago.
const { data: payment } = await paymentClient.post('/payments', { ... });
// 4) Genera el envío.
const { data: shipment } = await shippingClient.post('/shipments', { ... });
// 5) Confirma el pedido y cierra el carrito.
repo.updateOrderStatus(order.id, 'confirmed');
repo.closeCart(cart.id);
```

### 3.4. Servicio de base de datos

El archivo `shared/db.js` implementa el **servicio de base de datos**: centraliza la conexión a SQLite, define el esquema (migraciones) y expone la instancia a los repositorios. De esta forma, la lógica de negocio **no conoce los detalles del motor de datos** (principio de abstracción). Se habilitan `foreign_keys` y el modo `WAL` para concurrencia.

### 3.5. Servicio de autenticación

El servicio de autenticación (`services/auth`) gestiona el **registro** de usuarios (con hash bcrypt de la contraseña) y el **login**, que emite un **JWT** firmado con los datos del usuario (id, correo, rol). El token se valida en los demás servicios mediante el middleware compartido `shared/auth.js`, que además soporta autorización por rol (`requireRole('admin')`).

### 3.6. Base de datos implementada

El modelo de datos relacional incluye las siguientes tablas: `users`, `products`, `carts`, `cart_items`, `orders`, `payments` y `shipments`. Las relaciones principales:

- Un `user` tiene uno o varios `carts`.
- Un `cart` contiene varios `cart_items`, cada uno referido a un `product`.
- Al confirmar la compra se crea una `order` asociada a un `payment` y un `shipment`.

Se usan restricciones (`CHECK`, `UNIQUE`, `FOREIGN KEY`) para garantizar integridad: precios y stock no negativos, SKU y correos únicos, y cantidades positivas.

### 3.7. Contratos de la API (API definitions)

El contrato se define formalmente en `openapi/techstore.yaml` (OpenAPI 3.0). Describe todos los endpoints, esquemas de datos, códigos de respuesta y el esquema de seguridad `bearerAuth` (JWT). Este contrato se publica de forma interactiva en `/docs`, sirviendo tanto de documentación como de "fuente de verdad" para clientes y pruebas.

### 3.8. Buenas prácticas de implementación

- **Uso de frameworks:** Express para HTTP, Zod para validación, Jest para pruebas.
- **Separación de responsabilidades:** capas `routes` → `service` → `repository`, más una capa compartida (`shared/`) para infraestructura.
- **Gestión de dependencias:** `package.json` con versiones fijadas; configuración por variables de entorno.
- **Logs:** logging estructurado en JSON con nivel configurable.
- **Manejo de errores:** middleware centralizado que normaliza las respuestas de error y evita filtrar detalles internos.
- **Seguridad:** hashing de contraseñas, JWT, autorización por rol, rate limiting y validación de entradas.

### 3.9. Tests automatizados

Se implementaron tests con **Jest** y **Supertest**, cubriendo tanto la **lógica de negocio** como los **endpoints de la API**:

| Archivo | Tipo | Qué cubre |
|---------|------|-----------|
| `tests/auth.service.test.js` | Unitario | Registro, login, emisión de JWT, validaciones. |
| `tests/catalog.service.test.js` | Unitario | CRUD de productos, control de stock, borrado lógico. |
| `tests/payment.service.test.js` | Unitario | Aprobación/rechazo de pagos y validación. |
| `tests/api.endpoints.test.js` | Integración (HTTP) | Endpoints de auth y catálogo, autorización por rol, CRUD. |
| `tests/cart.checkout.test.js` | Integración | Orquestación del checkout (catálogo + pago + envío) con mocks. |

Los tests usan una base de datos **en memoria** para aislamiento y rapidez. Se ejecutan con `npm test`.

> **Nota de reproducibilidad.** En el entorno de desarrollo utilizado para este taller, el acceso al registro de paquetes estaba restringido, por lo que las dependencias (`express`, `better-sqlite3`, `jest`, etc.) deben instalarse con `npm install` en una máquina con acceso a internet antes de ejecutar los tests. La sintaxis de todos los módulos y pruebas fue verificada con `node --check`.

### 3.10. Despliegue en entorno de staging

El archivo `docker-compose.yml` define el entorno de **staging**: construye una imagen común y levanta cada microservicio y el gateway como contenedores independientes, compartiendo un volumen para la base de datos. Esto permite ejecutar **pruebas de integración y rendimiento** end-to-end con un solo comando:

```bash
docker compose up --build
docker compose run --rm seed   # poblar datos de ejemplo
```

El gateway queda disponible en `http://localhost:8080` y la documentación en `http://localhost:8080/docs`.

### 3.11. Monitoreo y observabilidad

- **Logs:** cada servicio emite logs estructurados (JSON) con servicio, método, ruta y código de estado, aptos para agregadores como ELK o Loki.
- **Métricas:** cada servicio expone `/metrics` en formato Prometheus, con un contador `http_requests_total` y un histograma `http_request_duration_seconds` (latencia por ruta y estado), además de las métricas por defecto del proceso.
- **Rastreo de errores:** el middleware de errores registra las excepciones no controladas (nivel `error`) con su stack.

Estas métricas corresponden a los umbrales definidos entre los requisitos no funcionales (rendimiento y fiabilidad) y pueden visualizarse en Grafana.

### 3.12. Documentación de la API para desarrolladores

La documentación interactiva (Swagger UI) explica cómo **autenticarse** (obtener el JWT en `/api/auth/login` y enviarlo como `Authorization: Bearer <token>`), e incluye los esquemas de **request/response** y los **posibles errores** (401, 403, 404, 402, 409). Ejemplo de uso:

```bash
# 1) Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techstore.com","password":"admin123"}'

# 2) Listar productos (público)
curl http://localhost:8080/api/products

# 3) Agregar al carrito (autenticado)
curl -X POST http://localhost:8080/api/cart/items \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'

# 4) Checkout
curl -X POST http://localhost:8080/api/cart/checkout \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"payment_method":"credit_card","card_number":"4111111111111234","address":"Calle 1 # 2-3"}'
```

<div style="page-break-after: always;"></div>

---

## 4. Resultados

Se obtuvo un **prototipo semifuncional** de la API de la tienda online TechStore con las siguientes características logradas:

- **Arquitectura de microservicios** funcional con un API Gateway y cinco servicios de dominio desacoplados.
- **Operaciones CRUD** completas sobre la base de datos para el catálogo, y operaciones de dominio para carrito, pagos y envíos.
- **Servicio de base de datos** que abstrae el acceso a SQLite, consumido por repositorios independientes.
- **Autenticación y autorización** con JWT y control de acceso por rol (administrador vs. cliente).
- **Flujo de compra completo** (checkout) que orquesta inventario, pago y envío en una sola transacción de negocio, con control de stock atómico para evitar sobreventa.
- **Contratos OpenAPI** publicados de forma interactiva.
- **Suite de tests automatizados** que cubre la lógica de negocio y los endpoints (33 casos de prueba distribuidos en 5 archivos).
- **Despliegue reproducible** en staging con Docker Compose.
- **Observabilidad** mediante logs estructurados y métricas Prometheus.

La solución demuestra cómo los **atributos de calidad** (escalabilidad, mantenibilidad, seguridad, rendimiento, fiabilidad y observabilidad) se traducen en **decisiones concretas de arquitectura**: separación en microservicios, capas internas, validación, manejo de errores, contenerización y monitoreo.

<div style="page-break-after: always;"></div>

---

## 5. Conclusiones

- La **arquitectura de microservicios** permite abordar los atributos de calidad de forma explícita: cada servicio puede escalarse, desplegarse y mantenerse de manera independiente, reduciendo el acoplamiento y el impacto de los fallos.
- Tratar los **atributos de calidad como requisitos no funcionales medibles** (Ingeno, 2018) —y no como aspectos opcionales— guía las decisiones de diseño y produce un sistema más robusto, seguro y mantenible.
- La **separación de responsabilidades** (gateway, servicios de dominio y capa de datos) y el uso de **contratos de API** facilitan la evolución del sistema y el trabajo en equipo.
- La incorporación temprana de **pruebas automatizadas, observabilidad y despliegue contenerizado** mejora la fiabilidad y acorta el ciclo de retroalimentación, beneficios directos para WebTech Solutions y cualquier organización que implemente proyectos similares.
- El principal beneficio de la solución es la **capacidad de crecer sin reescribir el sistema**: se pueden añadir nuevos servicios (p. ej., notificaciones o recomendaciones) sin afectar a los existentes, lo que se traduce en menor costo de evolución y mayor disponibilidad.

<div style="page-break-after: always;"></div>

---

## 6. Referencias

Bell, M. (2017). *Service-oriented modeling: Service analysis, design, and architecture* (Part six: Service-oriented software architecture, pp. 307–359). John Wiley & Sons, Incorporated.

Fowler, M., & Lewis, J. (2014). *Microservices: A definition of this new architectural term*. https://martinfowler.com/articles/microservices.html

Ingeno, J. (2018). *Software architect's handbook: Become a successful software architect by implementing effective architecture concepts* (Chapter 4: Software quality attributes, pp. 76–110). Packt Publishing, Limited.

International Organization for Standardization. (2023). *ISO/IEC 25010: Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model.*

OpenJS Foundation. (s. f.). *Express — Node.js web application framework*. https://expressjs.com/

OpenAPI Initiative. (s. f.). *OpenAPI Specification v3.0.3*. https://spec.openapis.org/oas/v3.0.3

*Nota de cumplimiento: el contenido proveniente de fuentes web fue parafraseado y sintetizado para cumplir con las restricciones de licencia y atribución.*

---

<div style="page-break-after: always;"></div>

## Anexo A — Cómo convertir este documento a Word (.docx) o PDF

Este documento está en Markdown. Para obtener el archivo **.docx** solicitado por el taller:

**Opción 1 — Pandoc (recomendada):**
```bash
pandoc docs/Documento_Tecnico_Taller_Semana8.md -o Documento_Tecnico_Taller_Semana8.docx
```

**Opción 2 — Editor en línea:** copiar el contenido en un editor Markdown (por ejemplo, Dillinger o StackEdit) y exportar a Word/PDF.

**Opción 3 — VS Code:** con la extensión "Markdown PDF" o "Markdown All in One", exportar a PDF/HTML y luego a Word.
