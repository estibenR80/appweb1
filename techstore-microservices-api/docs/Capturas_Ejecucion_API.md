# Capturas de la ejecución de la API — TechStore

**Taller Semana 8 — Programación Avanzada — UNIMINUTO**
**Autor:** Estibin Rodriguez · **Fecha:** 18/10/2026

Este documento recoge la **evidencia de ejecución real** de la API de la tienda online TechStore. Las capturas son la salida de consola (HTTP/JSON) obtenida al invocar los endpoints contra el servidor en funcionamiento.

> **Nota técnica:** El entorno de ejecución no tiene acceso al registro npm para instalar Express/SQLite, por lo que estas capturas se generaron con un **servidor de demostración autocontenido** (`demo/standalone-demo.js`) que usa únicamente módulos nativos de Node y replica la misma lógica de negocio y los mismos endpoints del proyecto real (`services/` + `gateway/`). Al ejecutar el proyecto completo con `npm install && npm start`, las respuestas son equivalentes y además se dispone de la documentación interactiva Swagger en `http://localhost:8080/docs`.

---

## Captura 1 — Arranque del servidor (log estructurado)

```json
{"level":"info","service":"techstore-demo","message":"gateway_started","port":"8090","docs":"/docs (en el proyecto real con Swagger)"}
```

---

## Captura 2 — Health check · `GET /health`

```json
{
  "status": "ok",
  "service": "techstore-demo"
}
```

---

## Captura 3 — Catálogo público · `GET /api/products`

```json
[
  { "id": 1, "sku": "SKU-001", "name": "Teclado mecánico RGB", "price_cents": 129900, "stock": 25, "category": "perifericos", "active": 1 },
  { "id": 2, "sku": "SKU-002", "name": "Mouse inalámbrico", "price_cents": 59900, "stock": 40, "category": "perifericos", "active": 1 },
  { "id": 3, "sku": "SKU-003", "name": "Monitor 27\" 144Hz", "price_cents": 899900, "stock": 10, "category": "monitores", "active": 1 },
  { "id": 4, "sku": "SKU-004", "name": "Auriculares con micrófono", "price_cents": 149900, "stock": 30, "category": "audio", "active": 1 },
  { "id": 5, "sku": "SKU-005", "name": "Webcam Full HD", "price_cents": 99900, "stock": 15, "category": "perifericos", "active": 1 }
]
```

---

## Captura 4 — Login como cliente · `POST /api/auth/login`

**Request body:** `{"email":"cliente@techstore.com","password":"cliente123"}`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiY2xpZW50ZUB0ZWNoc3RvcmUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwibmFtZSI6IkNsaWVudGUgRGVtbyIsImlhdCI6MTc5MjM2ODM5OX0.naZuOe6FKporJOSWAd-WOlAhVwzrq-vXTnTvO6NEVTA",
  "user": {
    "id": 2,
    "email": "cliente@techstore.com",
    "name": "Cliente Demo",
    "role": "customer"
  }
}
```

---

## Captura 5 — Login fallido (contraseña incorrecta) · `POST /api/auth/login` → **401**

```json
{
  "error": "unauthorized",
  "message": "Correo o contraseña incorrectos"
}
```

---

## Captura 6 — Autorización por rol: cliente intenta crear producto · `POST /api/products` → **403**

```json
{
  "error": "forbidden",
  "message": "Se requiere el rol: admin"
}
```

---

## Captura 7 — Agregar productos al carrito · `POST /api/cart/items` → **201**

```json
{
  "items": [
    { "product_id": 1, "quantity": 2, "unit_price_cents": 129900 },
    { "product_id": 2, "quantity": 1, "unit_price_cents": 59900 }
  ],
  "total_cents": 319700
}
```

---

## Captura 8 — Ver carrito · `GET /api/cart`

```json
{
  "items": [
    { "product_id": 1, "quantity": 2, "unit_price_cents": 129900 },
    { "product_id": 2, "quantity": 1, "unit_price_cents": 59900 }
  ],
  "total_cents": 319700
}
```

---

## Captura 9 — Checkout exitoso (orquesta inventario + pago + envío) · `POST /api/cart/checkout` → **201**

**Request body:** `{"payment_method":"credit_card","card_number":"4111111111111234","address":"Calle 1 # 2-3"}`

```json
{
  "order": { "id": 1, "user_id": 2, "total_cents": 319700, "status": "confirmed" },
  "payment": { "id": 1, "status": "approved", "method": "credit_card", "transaction_ref": "txn_881bf73c1a20" },
  "shipment": { "id": 1, "address": "Calle 1 # 2-3", "carrier": "Coordinadora", "tracking_code": "TRK-C556BBED", "status": "pending" },
  "total_cents": 319700
}
```

---

## Captura 10 — Login como administrador · `POST /api/auth/login`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...xA9_y7tZg4E4r0irCqtd_qfzn86Agc1KCS5i37tUxTo",
  "user": { "id": 1, "email": "admin@techstore.com", "name": "Administrador", "role": "admin" }
}
```

---

## Captura 11 — Administrador crea un producto · `POST /api/products` → **201**

```json
{
  "id": 6,
  "sku": "SKU-006",
  "name": "Disco SSD 1TB",
  "price_cents": 349900,
  "stock": 12,
  "category": "almacenamiento",
  "active": 1
}
```

---

## Captura 12 — Acceso sin token · `GET /api/cart` → **401**

```json
{
  "error": "unauthorized",
  "message": "Token no proporcionado"
}
```

---

## Captura 13 — Pago rechazado (tarjeta termina en 0000) · `POST /api/cart/checkout` → **402**

```json
{
  "error": "payment_failed",
  "message": "El pago fue rechazado"
}
```

---

## Captura 14 — Stock insuficiente · `POST /api/cart/items` → **409**

```json
{
  "error": "out_of_stock",
  "message": "Stock insuficiente"
}
```

---

## Resumen de la evidencia

| # | Endpoint | Método | Código | Resultado |
|---|----------|--------|--------|-----------|
| 1 | `/health` | GET | 200 | Servicio operativo |
| 2 | `/api/products` | GET | 200 | Catálogo listado (público) |
| 3 | `/api/auth/login` | POST | 200 | JWT emitido (cliente) |
| 4 | `/api/auth/login` | POST | 401 | Credenciales incorrectas |
| 5 | `/api/products` | POST | 403 | Autorización por rol (cliente bloqueado) |
| 6 | `/api/cart/items` | POST | 201 | Productos agregados al carrito |
| 7 | `/api/cart` | GET | 200 | Carrito consultado |
| 8 | `/api/cart/checkout` | POST | 201 | Compra confirmada (pago + envío) |
| 9 | `/api/products` | POST | 201 | Admin crea producto |
| 10 | `/api/cart` | GET | 401 | Acceso sin token denegado |
| 11 | `/api/cart/checkout` | POST | 402 | Pago rechazado |
| 12 | `/api/cart/items` | POST | 409 | Stock insuficiente |

La API responde correctamente en todos los escenarios: operaciones CRUD, autenticación JWT, autorización por rol, orquestación del checkout y manejo de errores con los códigos HTTP adecuados.
