<!--
  DOCUMENTO DE RESULTADOS — TALLER SEMANA 8
  Markdown convertible a Word/PDF. Documenta la práctica realizada y el enlace a GitHub.
-->

<div align="center">

# CORPORACIÓN UNIVERSITARIA MINUTO DE DIOS — UNIMINUTO

<br/>

## Resultados de la práctica: API con arquitectura de microservicios para una tienda online

<br/><br/>

**Documento de resultados — Taller Semana 8**

<br/>

**Autor:** Estibin Rodriguez

**Curso:** Programación Avanzada

**Docente:** Docente de Programación Avanzada

**Fecha de entrega:** 18 de octubre de 2026

</div>

---

## 1. Introducción

Este documento presenta los **resultados** de la práctica desarrollada en el Taller de la Semana 8, cuyo objetivo fue **codificar una API que vincula operaciones CRUD a una base de datos usando una arquitectura de microservicios** para una tienda online (TechStore), aplicando los atributos de calidad del software. Se resume todo lo construido, lo verificado y se incluye el **enlace al repositorio en GitHub** donde puede visualizarse y validarse el resultado.

---

## 2. Resultados de la práctica

### 2.1. Resumen general

Se construyó un **prototipo semifuncional** de API de tienda online con **arquitectura de microservicios**, totalmente codificado, versionado y publicado en GitHub. La solución cubre todos los dominios solicitados: catálogo de productos, inventario, carrito de compras, pasarela de pago (simulada), envíos y autenticación de usuarios.

### 2.2. Componentes implementados

| Componente | Descripción | Estado |
|------------|-------------|--------|
| **API Gateway** | Punto único de entrada: enrutamiento a los microservicios, verificación de JWT, rate limiting y documentación Swagger en `/docs`. | ✅ Implementado |
| **Servicio de autenticación** | Registro de usuarios con hashing bcrypt y login con emisión de JWT; autorización por rol (admin/cliente). | ✅ Implementado |
| **Servicio de catálogo e inventario** | CRUD completo de productos y control de stock con descuento atómico. | ✅ Implementado |
| **Servicio de carrito** | Gestión del carrito (agregar, consultar, eliminar) y orquestación del checkout. | ✅ Implementado |
| **Servicio de pagos** | Pasarela de pago simulada (aprueba/rechaza de forma determinista). | ✅ Implementado |
| **Servicio de envíos** | Generación de guías con transportadora y número de rastreo. | ✅ Implementado |
| **Servicio de base de datos** | Capa compartida que abstrae el acceso a SQLite; esquema con 7 tablas y restricciones de integridad. | ✅ Implementado |
| **Contratos de la API** | Especificación OpenAPI 3.0 con todos los endpoints, esquemas y seguridad. | ✅ Implementado |
| **Tests automatizados** | 33 casos de prueba (Jest + Supertest) sobre lógica de negocio y endpoints. | ✅ Implementado |
| **Despliegue en staging** | Docker + Docker Compose para levantar todo el sistema de forma reproducible. | ✅ Implementado |
| **Observabilidad** | Logs estructurados JSON (Winston) y métricas Prometheus (prom-client) por servicio. | ✅ Implementado |
| **Documento técnico** | Documento en Word (.docx) y Markdown con portada, índice, desarrollo y referencias APA. | ✅ Entregado |

### 2.3. Operaciones CRUD y flujo de negocio logrados

- **Create / Read / Update / Delete** de productos (catálogo), con borrado lógico para preservar la integridad referencial con los pedidos.
- **Gestión de carrito**: agregar ítems (validando stock contra el catálogo), consultar y eliminar.
- **Checkout completo** que orquesta en una sola transacción de negocio: reserva de stock → creación del pedido → cobro en el servicio de pagos → generación del envío → cierre del carrito.
- **Autenticación y autorización**: emisión y validación de JWT, con restricción de las operaciones de escritura del catálogo a usuarios administradores.

### 2.4. Atributos de calidad evidenciados

La práctica demuestra cómo los atributos de calidad se traducen en decisiones concretas de arquitectura:

- **Escalabilidad:** cada microservicio es independiente y puede escalarse por separado.
- **Mantenibilidad:** separación en capas (routes → service → repository) y bajo acoplamiento.
- **Seguridad:** JWT, bcrypt, autorización por rol, rate limiting y validación de entradas con Zod.
- **Fiabilidad:** manejo de errores centralizado, health checks y descuento de stock atómico (evita sobreventa).
- **Observabilidad:** logs y métricas por servicio.
- **Portabilidad:** contenerización con Docker y configuración por variables de entorno.

### 2.5. Verificaciones realizadas

| Verificación | Resultado |
|--------------|-----------|
| Sintaxis de los 34 módulos JavaScript (`node --check`) | ✅ Sin errores |
| Sintaxis de los 6 archivos de pruebas | ✅ Sin errores |
| Resolución de los 69 imports relativos entre módulos | ✅ 0 faltantes |
| Validación del paquete OOXML del documento Word (.docx) | ✅ Bien formado |
| Estructura OpenAPI 3.0 del contrato | ✅ Válida |

> **Nota:** El entorno de desarrollo utilizado no tenía acceso al registro de paquetes (npm), por lo que la ejecución de `npm install` y `npm test` se realiza en una máquina con conexión a internet. La corrección estructural del código fue verificada con `node --check` y la resolución de dependencias internas.

### 2.6. Estadísticas del entregable

- **51 archivos** versionados.
- **6 servicios** (1 gateway + 5 microservicios).
- **7 tablas** en el modelo de datos.
- **33 casos de prueba** automatizados en 5 archivos.
- **12+ endpoints** expuestos a través del gateway.

---

## 3. Enlace a GitHub (visualización de los resultados)

El resultado completo de la práctica está publicado en GitHub y puede visualizarse y validarse en los siguientes enlaces:

- **Pull Request (resumen del trabajo):** https://github.com/estibenR80/appweb1/pull/6
- **Código fuente del proyecto:** https://github.com/estibenR80/appweb1/tree/taller-semana8-api/techstore-microservices-api
- **Repositorio:** https://github.com/estibenR80/appweb1 (rama `taller-semana8-api`)

### Cómo clonar y validar la API

```bash
git clone -b taller-semana8-api https://github.com/estibenR80/appweb1.git
cd appweb1/techstore-microservices-api

npm install      # instala dependencias (requiere internet)
npm run seed     # crea y puebla la base de datos
npm test         # ejecuta los tests automatizados
npm start        # levanta el gateway en http://localhost:8080
```

- Documentación interactiva de la API: **http://localhost:8080/docs**
- Alternativa con contenedores: `docker compose up --build`

**Credenciales de ejemplo (seed):**
- Administrador: `admin@techstore.com` / `admin123`
- Cliente: `cliente@techstore.com` / `cliente123`

---

## 4. Conclusión

La práctica se completó satisfactoriamente: se obtuvo un prototipo funcional de API de tienda online basada en microservicios, con operaciones CRUD sobre una base de datos, autenticación, orquestación del proceso de compra, pruebas automatizadas, despliegue contenerizado y observabilidad. Todo el resultado quedó versionado y disponible en GitHub para su revisión y validación, cumpliendo los objetivos planteados y evidenciando la aplicación de los atributos de calidad en la arquitectura de software.

---

## Anexo — Conversión a Word/PDF

Este documento está en Markdown. Para obtenerlo en Word:
```bash
pandoc docs/Resultados_Practica_Taller_Semana8.md -o Resultados_Practica_Taller_Semana8.docx
```
También se incluye una versión `.docx` ya generada en la carpeta `docs/`.
