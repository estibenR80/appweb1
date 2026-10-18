#!/usr/bin/env python3
"""
Genera un archivo .docx NATIVO (Office Open XML) sin dependencias externas.
Un .docx es un ZIP con XML dentro; aquí construimos ese paquete manualmente
a partir del contenido del documento técnico del Taller Semana 8.
"""
import zipfile
import html
import os

# ---------------------------------------------------------------------------
# Contenido del documento como lista de bloques (tipo, texto).
# tipos: title, h1, h2, h3, p, bullet, code, pagebreak, center
# ---------------------------------------------------------------------------
BLOCKS = []

def add(kind, text=""):
    BLOCKS.append((kind, text))

# Portada
add("center_title", "CORPORACIÓN UNIVERSITARIA MINUTO DE DIOS — UNIMINUTO")
add("spacer")
add("center_h", "Diseño e implementación de una API con arquitectura de "
                "microservicios para una tienda online: aplicación de atributos "
                "de calidad en la arquitectura de software")
add("spacer")
add("center_p", "Documento técnico — Taller Semana 8")
add("spacer")
add("center_p", "Autor: Estibin Rodriguez")
add("center_p", "Curso: Programación Avanzada")
add("center_p", "Docente: Docente de Programación Avanzada")
add("center_p", "Fecha de entrega: 18 de octubre de 2026")
add("pagebreak")

# Índice
add("h1", "Índice")
for t in [
    "1. Introducción", "   1.1. Problemática", "   1.2. Objetivo general",
    "   1.3. Objetivos específicos", "2. Planeación",
    "   2.1. Requisitos funcionales",
    "   2.2. Requisitos no funcionales (atributos de calidad)",
    "   2.3. Plan de trabajo y actividades", "   2.4. Stack tecnológico",
    "3. Desarrollo", "   3.1. Arquitectura de microservicios",
    "   3.2. Servicio de API (API Gateway)",
    "   3.3. Servicio de lógica de negocio",
    "   3.4. Servicio de base de datos", "   3.5. Servicio de autenticación",
    "   3.6. Base de datos implementada",
    "   3.7. Contratos de la API (API definitions)",
    "   3.8. Buenas prácticas de implementación",
    "   3.9. Tests automatizados", "   3.10. Despliegue en entorno de staging",
    "   3.11. Monitoreo y observabilidad",
    "   3.12. Documentación de la API para desarrolladores",
    "4. Resultados", "5. Conclusiones", "6. Referencias",
]:
    add("toc", t)
add("pagebreak")

# 1. Introducción
add("h1", "1. Introducción")
add("h2", "1.1. Problemática")
add("p", "El comercio electrónico exige plataformas capaces de crecer, mantenerse "
         "y evolucionar sin comprometer la experiencia del usuario ni la estabilidad "
         "del sistema. Las aplicaciones construidas como un único bloque (arquitectura "
         "monolítica) suelen volverse difíciles de escalar y mantener: un cambio en un "
         "módulo obliga a desplegar toda la aplicación y un fallo puede afectar a todo "
         "el sistema.")
add("p", "El problema planteado en este taller consiste en codificar una API que "
         "vincule operaciones CRUD a una base de datos usando una arquitectura de "
         "microservicios para una tienda online que requiere carrito de compras, "
         "catálogo de productos, pasarela de pago, inventario y envíos. La solución "
         "debe aplicar de forma explícita los atributos de calidad del software "
         "(escalabilidad, mantenibilidad, rendimiento, seguridad, fiabilidad, etc.) "
         "en el diseño de la arquitectura.")
add("h2", "1.2. Objetivo general")
add("p", "Diseñar e implementar un prototipo semifuncional de API basada en "
         "microservicios para una tienda online (TechStore), que incorpore operaciones "
         "CRUD sobre una base de datos, autenticación, y la orquestación de catálogo, "
         "inventario, carrito, pagos y envíos, aplicando buenas prácticas y atributos "
         "de calidad de la arquitectura de software.")
add("h2", "1.3. Objetivos específicos")
for b in [
    "Definir los requisitos funcionales y no funcionales de la API.",
    "Diseñar una arquitectura de microservicios con separación de responsabilidades.",
    "Implementar los microservicios (API Gateway, autenticación, catálogo/inventario, "
    "carrito, pagos y envíos) y la base de datos.",
    "Definir los contratos de la API mediante OpenAPI.",
    "Implementar tests automatizados para la lógica de negocio y los endpoints.",
    "Preparar el despliegue en un entorno de staging con Docker.",
    "Incorporar observabilidad (logs, métricas) y documentación para desarrolladores.",
]:
    add("bullet", b)
add("pagebreak")

# 2. Planeación
add("h1", "2. Planeación")
add("h2", "2.1. Requisitos funcionales")
for b in [
    "RF-01 Registrar usuarios y autenticarlos (Create/Read).",
    "RF-02 Emitir y validar tokens JWT.",
    "RF-03 Gestionar el catálogo de productos: crear, consultar, actualizar, eliminar (CRUD completo).",
    "RF-04 Controlar el inventario (stock) de los productos (Update - decremento).",
    "RF-05 Gestionar el carrito de compras: agregar, consultar, eliminar ítems (CRUD parcial).",
    "RF-06 Procesar el checkout: reservar stock, cobrar y generar envío (Create).",
    "RF-07 Procesar pagos a través de una pasarela simulada (Create/Read).",
    "RF-08 Generar y consultar envíos con número de rastreo (Create/Read).",
    "RF-09 Restringir operaciones de escritura del catálogo a administradores.",
]:
    add("bullet", b)
add("h2", "2.2. Requisitos no funcionales (atributos de calidad)")
add("p", "La arquitectura se diseñó aplicando los atributos de calidad descritos por "
         "Ingeno (2018), que constituyen los requisitos no funcionales del sistema:")
for b in [
    "Escalabilidad: cada microservicio es independiente y puede escalar horizontalmente por separado.",
    "Mantenibilidad: separación de responsabilidades en capas (routes, controllers/services, repositories) y bajo acoplamiento.",
    "Rendimiento: base de datos con índices, consultas parametrizadas e histograma de latencia por endpoint.",
    "Seguridad: autenticación JWT, hashing bcrypt, autorización por rol, rate limiting y validación de entradas con Zod.",
    "Fiabilidad/disponibilidad: manejo de errores centralizado, health checks y descuento de stock atómico.",
    "Observabilidad: logs estructurados JSON (Winston) y métricas Prometheus (prom-client).",
    "Portabilidad: contenerización con Docker y configuración por variables de entorno.",
    "Testabilidad: lógica de negocio desacoplada de la infraestructura, con tests unitarios y de integración.",
]:
    add("bullet", b)
add("h2", "2.3. Plan de trabajo y actividades")
for i, b in enumerate([
    "Análisis: definición de requisitos funcionales y no funcionales.",
    "Diseño: arquitectura de microservicios, modelo de datos y contratos de API.",
    "Implementación de la capa de datos: servicio de base de datos compartido (SQLite) con su esquema.",
    "Implementación de los microservicios: autenticación, catálogo/inventario, carrito, pagos y envíos.",
    "Implementación del API Gateway: enrutamiento, seguridad y documentación.",
    "Pruebas: tests unitarios (lógica de negocio) y de integración (endpoints y checkout).",
    "Despliegue y observabilidad: Docker Compose para staging, logs y métricas.",
], 1):
    add("bullet", f"Fase {i}. {b}")
add("h2", "2.4. Stack tecnológico")
for b in [
    "Node.js 22 como runtime; Express como framework HTTP.",
    "SQLite (better-sqlite3) como base de datos, abstraída por el servicio de datos.",
    "JWT + bcrypt para autenticación; Zod para validación.",
    "Winston para logs; prom-client para métricas.",
    "Jest + Supertest para pruebas; OpenAPI 3 + Swagger UI para documentación.",
    "Docker + Docker Compose para el despliegue en staging.",
]:
    add("bullet", b)
add("pagebreak")

# 3. Desarrollo
add("h1", "3. Desarrollo")
add("h2", "3.1. Arquitectura de microservicios")
add("p", "La solución se compone de un API Gateway (punto único de entrada) y cinco "
         "microservicios de dominio, apoyados por una capa de datos compartida que "
         "abstrae la base de datos. Cada microservicio es un proceso independiente, "
         "con su propio puerto, endpoints /health y /metrics, y comunicación mediante "
         "HTTP/JSON. El microservicio de carrito actúa como orquestador del proceso de "
         "compra (checkout): coordina la reserva de stock en el catálogo, el cobro en el "
         "servicio de pagos y la generación del envío.")
add("h2", "3.2. Servicio de API (API Gateway)")
add("p", "El gateway es el único punto expuesto al cliente. Responsabilidades: "
         "enrutamiento de /api/<servicio> hacia el microservicio correspondiente, rate "
         "limiting (300 req/min), documentación interactiva en /docs (Swagger UI a partir "
         "del contrato OpenAPI) y health/métricas centralizados. Así, los clientes se "
         "desacoplan de la topología interna.")
add("h2", "3.3. Servicio de lógica de negocio")
add("p", "Cada microservicio implementa su lógica de negocio en una capa service.js "
         "separada de las rutas HTTP y del acceso a datos. El servicio de carrito valida "
         "la entrada, consulta el catálogo, crea el pedido, procesa el pago y genera el "
         "envío, y solo entonces cierra el carrito.")
add("code", "// Orquestación del checkout (services/cart/src/service.js)\n"
            "await catalogClient.post('/internal/reserve-stock', { items });\n"
            "const order = repo.createOrder({ userId, cartId, totalCents });\n"
            "const { data: payment } = await paymentClient.post('/payments', {...});\n"
            "const { data: shipment } = await shippingClient.post('/shipments', {...});\n"
            "repo.updateOrderStatus(order.id, 'confirmed');\n"
            "repo.closeCart(cart.id);")
add("h2", "3.4. Servicio de base de datos")
add("p", "shared/db.js centraliza la conexión a SQLite, define el esquema (migraciones) "
         "y expone la instancia a los repositorios. La lógica de negocio no conoce los "
         "detalles del motor de datos (abstracción). Se habilitan foreign_keys y el modo "
         "WAL para concurrencia.")
add("h2", "3.5. Servicio de autenticación")
add("p", "Gestiona el registro de usuarios (con hash bcrypt de la contraseña) y el "
         "login, que emite un JWT firmado con id, correo y rol. El token se valida en los "
         "demás servicios mediante el middleware compartido, que soporta autorización por "
         "rol (requireRole('admin')).")
add("h2", "3.6. Base de datos implementada")
add("p", "El modelo relacional incluye las tablas users, products, carts, cart_items, "
         "orders, payments y shipments. Un usuario tiene uno o varios carritos; un carrito "
         "contiene varios ítems referidos a productos; al confirmar la compra se crea una "
         "orden asociada a un pago y un envío. Se usan restricciones CHECK, UNIQUE y "
         "FOREIGN KEY para garantizar integridad.")
add("h2", "3.7. Contratos de la API (API definitions)")
add("p", "El contrato se define en openapi/techstore.yaml (OpenAPI 3.0): endpoints, "
         "esquemas de datos, códigos de respuesta y el esquema de seguridad bearerAuth "
         "(JWT). Se publica de forma interactiva en /docs.")
add("h2", "3.8. Buenas prácticas de implementación")
for b in [
    "Uso de frameworks: Express, Zod, Jest.",
    "Separación de responsabilidades: routes, service, repository y capa compartida (shared/).",
    "Gestión de dependencias con package.json y configuración por variables de entorno.",
    "Logs estructurados en JSON con nivel configurable.",
    "Manejo de errores centralizado que normaliza respuestas y no filtra detalles internos.",
    "Seguridad: hashing de contraseñas, JWT, autorización por rol, rate limiting y validación.",
]:
    add("bullet", b)
add("h2", "3.9. Tests automatizados")
add("p", "Se implementaron tests con Jest y Supertest cubriendo la lógica de negocio y "
         "los endpoints de la API:")
for b in [
    "auth.service.test.js (unitario): registro, login, emisión de JWT y validaciones.",
    "catalog.service.test.js (unitario): CRUD de productos, control de stock, borrado lógico.",
    "payment.service.test.js (unitario): aprobación/rechazo de pagos y validación.",
    "api.endpoints.test.js (integración HTTP): endpoints de auth y catálogo, autorización, CRUD.",
    "cart.checkout.test.js (integración): orquestación del checkout con mocks.",
]:
    add("bullet", b)
add("p", "Los tests usan una base de datos en memoria para aislamiento y rapidez; se "
         "ejecutan con npm test. Nota de reproducibilidad: en el entorno de desarrollo el "
         "acceso al registro de paquetes estaba restringido, por lo que las dependencias "
         "deben instalarse con npm install en una máquina con acceso a internet antes de "
         "ejecutar los tests. La sintaxis de todos los módulos y pruebas fue verificada con "
         "node --check.")
add("h2", "3.10. Despliegue en entorno de staging")
add("p", "docker-compose.yml define el entorno de staging: construye una imagen común y "
         "levanta cada microservicio y el gateway como contenedores independientes, "
         "compartiendo un volumen para la base de datos. Permite pruebas de integración y "
         "rendimiento end-to-end con 'docker compose up --build'. El gateway queda en "
         "http://localhost:8080 y la documentación en /docs.")
add("h2", "3.11. Monitoreo y observabilidad")
for b in [
    "Logs: cada servicio emite logs JSON con servicio, método, ruta y estado.",
    "Métricas: cada servicio expone /metrics en formato Prometheus con contador de "
    "peticiones e histograma de latencia por ruta y estado.",
    "Rastreo de errores: el middleware registra las excepciones no controladas con su stack.",
]:
    add("bullet", b)
add("h2", "3.12. Documentación de la API para desarrolladores")
add("p", "La documentación interactiva (Swagger UI) explica cómo autenticarse (obtener "
         "el JWT en /api/auth/login y enviarlo como Authorization: Bearer <token>), e "
         "incluye los esquemas de request/response y los posibles errores (401, 403, 404, "
         "402, 409).")
add("code", "# Login\n"
            "curl -X POST http://localhost:8080/api/auth/login \\\n"
            "  -H 'Content-Type: application/json' \\\n"
            "  -d '{\"email\":\"admin@techstore.com\",\"password\":\"admin123\"}'\n\n"
            "# Checkout (autenticado)\n"
            "curl -X POST http://localhost:8080/api/cart/checkout \\\n"
            "  -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' \\\n"
            "  -d '{\"payment_method\":\"credit_card\",\"card_number\":\"4111111111111234\","
            "\"address\":\"Calle 1 # 2-3\"}'")
add("pagebreak")

# 4. Resultados
add("h1", "4. Resultados")
add("p", "Se obtuvo un prototipo semifuncional de la API de la tienda online TechStore "
         "con las siguientes características logradas:")
for b in [
    "Arquitectura de microservicios funcional con un API Gateway y cinco servicios de dominio desacoplados.",
    "Operaciones CRUD completas sobre la base de datos para el catálogo, y operaciones de dominio para carrito, pagos y envíos.",
    "Servicio de base de datos que abstrae el acceso a SQLite, consumido por repositorios independientes.",
    "Autenticación y autorización con JWT y control de acceso por rol (administrador vs. cliente).",
    "Flujo de compra completo (checkout) que orquesta inventario, pago y envío, con control de stock atómico para evitar sobreventa.",
    "Contratos OpenAPI publicados de forma interactiva.",
    "Suite de tests automatizados que cubre la lógica de negocio y los endpoints (33 casos en 5 archivos).",
    "Despliegue reproducible en staging con Docker Compose.",
    "Observabilidad mediante logs estructurados y métricas Prometheus.",
]:
    add("bullet", b)
add("p", "La solución demuestra cómo los atributos de calidad (escalabilidad, "
         "mantenibilidad, seguridad, rendimiento, fiabilidad y observabilidad) se traducen "
         "en decisiones concretas de arquitectura.")
add("pagebreak")

# 5. Conclusiones
add("h1", "5. Conclusiones")
for b in [
    "La arquitectura de microservicios permite abordar los atributos de calidad de forma "
    "explícita: cada servicio puede escalarse, desplegarse y mantenerse de forma independiente.",
    "Tratar los atributos de calidad como requisitos no funcionales medibles (Ingeno, 2018) "
    "guía las decisiones de diseño y produce un sistema más robusto, seguro y mantenible.",
    "La separación de responsabilidades y el uso de contratos de API facilitan la evolución "
    "del sistema y el trabajo en equipo.",
    "La incorporación temprana de pruebas automatizadas, observabilidad y despliegue "
    "contenerizado mejora la fiabilidad y acorta el ciclo de retroalimentación.",
    "El principal beneficio es la capacidad de crecer sin reescribir el sistema: se pueden "
    "añadir nuevos servicios sin afectar a los existentes, con menor costo de evolución y "
    "mayor disponibilidad.",
]:
    add("bullet", b)
add("pagebreak")

# 6. Referencias
add("h1", "6. Referencias")
for b in [
    "Bell, M. (2017). Service-oriented modeling: Service analysis, design, and architecture "
    "(Part six: Service-oriented software architecture, pp. 307-359). John Wiley & Sons, Incorporated.",
    "Fowler, M., & Lewis, J. (2014). Microservices: A definition of this new architectural term. "
    "https://martinfowler.com/articles/microservices.html",
    "Ingeno, J. (2018). Software architect's handbook: Become a successful software architect by "
    "implementing effective architecture concepts (Chapter 4: Software quality attributes, pp. 76-110). "
    "Packt Publishing, Limited.",
    "International Organization for Standardization. (2023). ISO/IEC 25010: Systems and software "
    "engineering - SQuaRE - Product quality model.",
    "OpenJS Foundation. (s. f.). Express - Node.js web application framework. https://expressjs.com/",
    "OpenAPI Initiative. (s. f.). OpenAPI Specification v3.0.3. https://spec.openapis.org/oas/v3.0.3",
]:
    add("ref", b)

# ---------------------------------------------------------------------------
# Generación del XML del documento
# ---------------------------------------------------------------------------
def esc(t):
    return html.escape(t, quote=False)

def run(text, bold=False, size=None, color=None, mono=False):
    rpr = "<w:rPr>"
    if bold:
        rpr += "<w:b/>"
    if size:
        rpr += f'<w:sz w:val="{size}"/>'
    if color:
        rpr += f'<w:color w:val="{color}"/>'
    if mono:
        rpr += '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>'
    rpr += "</w:rPr>"
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'

def para(runs_xml, jc=None, spacing_after=120, ind=None, shade=False):
    ppr = "<w:pPr>"
    if jc:
        ppr += f'<w:jc w:val="{jc}"/>'
    if ind:
        ppr += f'<w:ind w:left="{ind}"/>'
    if shade:
        ppr += '<w:shd w:val="clear" w:fill="F2F2F2"/>'
    ppr += f'<w:spacing w:after="{spacing_after}"/></w:pPr>'
    return f"<w:p>{ppr}{runs_xml}</w:p>"

body = []
for kind, text in BLOCKS:
    if kind == "center_title":
        body.append(para(run(text, bold=True, size=36, color="1F3864"), jc="center", spacing_after=240))
    elif kind == "center_h":
        body.append(para(run(text, bold=True, size=30, color="2E74B5"), jc="center", spacing_after=240))
    elif kind == "center_p":
        body.append(para(run(text, size=24), jc="center", spacing_after=80))
    elif kind == "center_spacer" or kind == "spacer":
        body.append(para(run(""), spacing_after=120))
    elif kind == "h1":
        body.append(para(run(text, bold=True, size=30, color="1F3864"), spacing_after=160))
    elif kind == "h2":
        body.append(para(run(text, bold=True, size=26, color="2E74B5"), spacing_after=120))
    elif kind == "h3":
        body.append(para(run(text, bold=True, size=24), spacing_after=100))
    elif kind == "p":
        body.append(para(run(text, size=22), jc="both"))
    elif kind == "toc":
        body.append(para(run(text, size=22), spacing_after=40, ind=240))
    elif kind == "bullet":
        body.append(para(run("•  ", size=22) + run(text, size=22), spacing_after=80, ind=360))
    elif kind == "ref":
        body.append(para(run(text, size=22), jc="both", spacing_after=120, ind=360))
    elif kind == "code":
        for line in text.split("\n"):
            body.append(para(run(line if line else " ", size=20, mono=True), spacing_after=0, ind=240, shade=True))
        body.append(para(run(""), spacing_after=120))
    elif kind == "pagebreak":
        body.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

document_xml = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:body>' + "".join(body) +
    '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>'
    '<w:pgMar w:top="1440" w:bottom="1440" w:left="1440" w:right="1440"/></w:sectPr>'
    '</w:body></w:document>'
)

content_types = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    '</Types>'
)

rels = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    '</Relationships>'
)

out = os.path.join(os.path.dirname(__file__), "Documento_Tecnico_Taller_Semana8.docx")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels)
    z.writestr("word/document.xml", document_xml)

print("DOCX generado:", out)
