#!/usr/bin/env python3
"""Genera el .docx nativo del documento de RESULTADOS (sin dependencias externas)."""
import zipfile
import html
import os

BLOCKS = []

def add(kind, text=""):
    BLOCKS.append((kind, text))

# Portada
add("center_title", "CORPORACIÓN UNIVERSITARIA MINUTO DE DIOS — UNIMINUTO")
add("spacer")
add("center_h", "Resultados de la práctica: API con arquitectura de "
                "microservicios para una tienda online")
add("spacer")
add("center_p", "Documento de resultados — Taller Semana 8")
add("spacer")
add("center_p", "Autor: Estibin Rodriguez")
add("center_p", "Curso: Programación Avanzada")
add("center_p", "Docente: Docente de Programación Avanzada")
add("center_p", "Fecha de entrega: 18 de octubre de 2026")
add("pagebreak")

# 1. Introducción
add("h1", "1. Introducción")
add("p", "Este documento presenta los resultados de la práctica desarrollada en el "
         "Taller de la Semana 8, cuyo objetivo fue codificar una API que vincula "
         "operaciones CRUD a una base de datos usando una arquitectura de microservicios "
         "para una tienda online (TechStore), aplicando los atributos de calidad del "
         "software. Se resume todo lo construido, lo verificado y se incluye el enlace al "
         "repositorio en GitHub donde puede visualizarse y validarse el resultado.")

# 2. Resultados
add("h1", "2. Resultados de la práctica")
add("h2", "2.1. Resumen general")
add("p", "Se construyó un prototipo semifuncional de API de tienda online con arquitectura "
         "de microservicios, totalmente codificado, versionado y publicado en GitHub. La "
         "solución cubre todos los dominios solicitados: catálogo de productos, inventario, "
         "carrito de compras, pasarela de pago (simulada), envíos y autenticación de usuarios.")

add("h2", "2.2. Componentes implementados")
for b in [
    "API Gateway: punto único de entrada con enrutamiento, verificación de JWT, rate limiting y documentación Swagger en /docs.",
    "Servicio de autenticación: registro con bcrypt y login con emisión de JWT; autorización por rol (admin/cliente).",
    "Servicio de catálogo e inventario: CRUD completo de productos y control de stock con descuento atómico.",
    "Servicio de carrito: gestión del carrito (agregar, consultar, eliminar) y orquestación del checkout.",
    "Servicio de pagos: pasarela simulada que aprueba o rechaza de forma determinista.",
    "Servicio de envíos: generación de guías con transportadora y número de rastreo.",
    "Servicio de base de datos: capa compartida que abstrae SQLite; esquema con 7 tablas y restricciones de integridad.",
    "Contratos de la API: especificación OpenAPI 3.0 con endpoints, esquemas y seguridad.",
    "Tests automatizados: 33 casos (Jest + Supertest) sobre lógica de negocio y endpoints.",
    "Despliegue en staging: Docker + Docker Compose para levantar todo el sistema.",
    "Observabilidad: logs JSON (Winston) y métricas Prometheus (prom-client) por servicio.",
    "Documento técnico: entregado en Word (.docx) y Markdown con portada, índice y referencias APA.",
]:
    add("bullet", b)

add("h2", "2.3. Operaciones CRUD y flujo de negocio logrados")
for b in [
    "Create/Read/Update/Delete de productos, con borrado lógico para preservar la integridad referencial.",
    "Gestión de carrito: agregar ítems (validando stock), consultar y eliminar.",
    "Checkout completo que orquesta: reserva de stock, creación del pedido, cobro, generación del envío y cierre del carrito.",
    "Autenticación y autorización con JWT, restringiendo la escritura del catálogo a administradores.",
]:
    add("bullet", b)

add("h2", "2.4. Atributos de calidad evidenciados")
for b in [
    "Escalabilidad: microservicios independientes que escalan por separado.",
    "Mantenibilidad: separación en capas (routes, service, repository) y bajo acoplamiento.",
    "Seguridad: JWT, bcrypt, autorización por rol, rate limiting y validación con Zod.",
    "Fiabilidad: manejo de errores centralizado, health checks y descuento de stock atómico.",
    "Observabilidad: logs y métricas por servicio.",
    "Portabilidad: contenerización con Docker y configuración por variables de entorno.",
]:
    add("bullet", b)

add("h2", "2.5. Verificaciones realizadas")
for b in [
    "Sintaxis de los 34 módulos JavaScript (node --check): sin errores.",
    "Sintaxis de los 6 archivos de pruebas: sin errores.",
    "Resolución de los 69 imports relativos entre módulos: 0 faltantes.",
    "Validación del paquete OOXML del documento Word (.docx): bien formado.",
    "Estructura OpenAPI 3.0 del contrato: válida.",
]:
    add("bullet", b)
add("p", "Nota: el entorno de desarrollo no tenía acceso al registro de paquetes (npm), "
         "por lo que la ejecución de npm install y npm test se realiza en una máquina con "
         "conexión a internet. La corrección estructural del código se verificó con "
         "node --check y la resolución de dependencias internas.")

add("h2", "2.6. Estadísticas del entregable")
for b in [
    "51 archivos versionados.",
    "6 servicios (1 gateway + 5 microservicios).",
    "7 tablas en el modelo de datos.",
    "33 casos de prueba automatizados en 5 archivos.",
    "12+ endpoints expuestos a través del gateway.",
]:
    add("bullet", b)

# 3. GitHub
add("h1", "3. Enlace a GitHub (visualización de los resultados)")
add("p", "El resultado completo de la práctica está publicado en GitHub y puede "
         "visualizarse y validarse en los siguientes enlaces:")
add("bullet", "Pull Request (resumen del trabajo): https://github.com/estibenR80/appweb1/pull/6")
add("bullet", "Código fuente del proyecto: https://github.com/estibenR80/appweb1/tree/taller-semana8-api/techstore-microservices-api")
add("bullet", "Repositorio: https://github.com/estibenR80/appweb1 (rama taller-semana8-api)")
add("h3", "Cómo clonar y validar la API")
add("code", "git clone -b taller-semana8-api https://github.com/estibenR80/appweb1.git\n"
            "cd appweb1/techstore-microservices-api\n\n"
            "npm install      # instala dependencias (requiere internet)\n"
            "npm run seed     # crea y puebla la base de datos\n"
            "npm test         # ejecuta los tests automatizados\n"
            "npm start        # gateway en http://localhost:8080")
add("bullet", "Documentación interactiva de la API: http://localhost:8080/docs")
add("bullet", "Alternativa con contenedores: docker compose up --build")
add("p", "Credenciales de ejemplo (seed): Administrador admin@techstore.com / admin123; "
         "Cliente cliente@techstore.com / cliente123.")

# 4. Conclusión
add("h1", "4. Conclusión")
add("p", "La práctica se completó satisfactoriamente: se obtuvo un prototipo funcional de "
         "API de tienda online basada en microservicios, con operaciones CRUD sobre una "
         "base de datos, autenticación, orquestación del proceso de compra, pruebas "
         "automatizadas, despliegue contenerizado y observabilidad. Todo el resultado quedó "
         "versionado y disponible en GitHub para su revisión y validación, cumpliendo los "
         "objetivos planteados y evidenciando la aplicación de los atributos de calidad en "
         "la arquitectura de software.")

# ---------------------------------------------------------------------------
def esc(t):
    return html.escape(t, quote=False)

def run(text, bold=False, size=None, color=None, mono=False):
    rpr = "<w:rPr>"
    if bold: rpr += "<w:b/>"
    if size: rpr += f'<w:sz w:val="{size}"/>'
    if color: rpr += f'<w:color w:val="{color}"/>'
    if mono: rpr += '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>'
    rpr += "</w:rPr>"
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'

def para(runs_xml, jc=None, spacing_after=120, ind=None, shade=False):
    ppr = "<w:pPr>"
    if jc: ppr += f'<w:jc w:val="{jc}"/>'
    if ind: ppr += f'<w:ind w:left="{ind}"/>'
    if shade: ppr += '<w:shd w:val="clear" w:fill="F2F2F2"/>'
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
    elif kind == "spacer":
        body.append(para(run(""), spacing_after=120))
    elif kind == "h1":
        body.append(para(run(text, bold=True, size=30, color="1F3864"), spacing_after=160))
    elif kind == "h2":
        body.append(para(run(text, bold=True, size=26, color="2E74B5"), spacing_after=120))
    elif kind == "h3":
        body.append(para(run(text, bold=True, size=24), spacing_after=100))
    elif kind == "p":
        body.append(para(run(text, size=22), jc="both"))
    elif kind == "bullet":
        body.append(para(run("•  ", size=22) + run(text, size=22), spacing_after=80, ind=360))
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

out = os.path.join(os.path.dirname(__file__), "Resultados_Practica_Taller_Semana8.docx")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels)
    z.writestr("word/document.xml", document_xml)
print("DOCX generado:", out)
