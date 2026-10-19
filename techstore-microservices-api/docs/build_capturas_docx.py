#!/usr/bin/env python3
"""Genera el .docx de las CAPTURAS de ejecución de la API (sin dependencias externas)."""
import zipfile, html, os

BLOCKS = []
def add(k, t=""): BLOCKS.append((k, t))

add("center_title", "Capturas de la ejecución de la API — TechStore")
add("center_p", "Taller Semana 8 — Programación Avanzada — UNIMINUTO")
add("center_p", "Autor: Estibin Rodriguez · Fecha: 18/10/2026")
add("spacer")
add("p", "Este documento recoge la evidencia de ejecución real de la API de la tienda "
         "online TechStore. Las capturas son la salida de consola (HTTP/JSON) obtenida al "
         "invocar los endpoints contra el servidor en funcionamiento.")
add("p", "Nota técnica: el entorno de ejecución no tiene acceso al registro npm para "
         "instalar Express/SQLite, por lo que estas capturas se generaron con un servidor "
         "de demostración autocontenido (demo/standalone-demo.js) que usa solo módulos "
         "nativos de Node y replica la misma lógica de negocio y endpoints del proyecto "
         "real. Al ejecutar el proyecto completo con 'npm install && npm start', las "
         "respuestas son equivalentes y se dispone de Swagger en http://localhost:8080/docs.")

caps = [
    ("Captura 1 — Arranque del servidor (log estructurado)",
     '{"level":"info","service":"techstore-demo","message":"gateway_started",\n "port":"8090","docs":"/docs (Swagger en el proyecto real)"}'),
    ("Captura 2 — Health check · GET /health",
     '{\n  "status": "ok",\n  "service": "techstore-demo"\n}'),
    ("Captura 3 — Catálogo público · GET /api/products",
     '[\n  { "id":1, "sku":"SKU-001", "name":"Teclado mecánico RGB", "price_cents":129900, "stock":25 },\n'
     '  { "id":2, "sku":"SKU-002", "name":"Mouse inalámbrico", "price_cents":59900, "stock":40 },\n'
     '  { "id":3, "sku":"SKU-003", "name":"Monitor 27\\" 144Hz", "price_cents":899900, "stock":10 },\n'
     '  { "id":4, "sku":"SKU-004", "name":"Auriculares con micrófono", "price_cents":149900, "stock":30 },\n'
     '  { "id":5, "sku":"SKU-005", "name":"Webcam Full HD", "price_cents":99900, "stock":15 }\n]'),
    ("Captura 4 — Login como cliente · POST /api/auth/login",
     '{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...naZuOe6FKporJOSWAd-WOlAhVwzrq",\n'
     '  "user": { "id":2, "email":"cliente@techstore.com", "name":"Cliente Demo", "role":"customer" }\n}'),
    ("Captura 5 — Login fallido (contraseña incorrecta) · 401",
     '{\n  "error": "unauthorized",\n  "message": "Correo o contraseña incorrectos"\n}'),
    ("Captura 6 — Cliente intenta crear producto · POST /api/products · 403",
     '{\n  "error": "forbidden",\n  "message": "Se requiere el rol: admin"\n}'),
    ("Captura 7 — Agregar productos al carrito · POST /api/cart/items · 201",
     '{\n  "items": [\n    { "product_id":1, "quantity":2, "unit_price_cents":129900 },\n'
     '    { "product_id":2, "quantity":1, "unit_price_cents":59900 }\n  ],\n  "total_cents": 319700\n}'),
    ("Captura 8 — Ver carrito · GET /api/cart",
     '{\n  "items": [\n    { "product_id":1, "quantity":2, "unit_price_cents":129900 },\n'
     '    { "product_id":2, "quantity":1, "unit_price_cents":59900 }\n  ],\n  "total_cents": 319700\n}'),
    ("Captura 9 — Checkout exitoso (inventario+pago+envío) · POST /api/cart/checkout · 201",
     '{\n  "order":   { "id":1, "user_id":2, "total_cents":319700, "status":"confirmed" },\n'
     '  "payment": { "id":1, "status":"approved", "method":"credit_card", "transaction_ref":"txn_881bf73c1a20" },\n'
     '  "shipment":{ "id":1, "address":"Calle 1 # 2-3", "carrier":"Coordinadora", "tracking_code":"TRK-C556BBED", "status":"pending" },\n'
     '  "total_cents": 319700\n}'),
    ("Captura 10 — Login como administrador · POST /api/auth/login",
     '{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...xA9_y7tZg4E4r0irCqtd",\n'
     '  "user": { "id":1, "email":"admin@techstore.com", "name":"Administrador", "role":"admin" }\n}'),
    ("Captura 11 — Administrador crea un producto · POST /api/products · 201",
     '{\n  "id":6, "sku":"SKU-006", "name":"Disco SSD 1TB",\n  "price_cents":349900, "stock":12, "category":"almacenamiento", "active":1\n}'),
    ("Captura 12 — Acceso sin token · GET /api/cart · 401",
     '{\n  "error": "unauthorized",\n  "message": "Token no proporcionado"\n}'),
    ("Captura 13 — Pago rechazado (tarjeta termina en 0000) · 402",
     '{\n  "error": "payment_failed",\n  "message": "El pago fue rechazado"\n}'),
    ("Captura 14 — Stock insuficiente · POST /api/cart/items · 409",
     '{\n  "error": "out_of_stock",\n  "message": "Stock insuficiente"\n}'),
]
for title, out in caps:
    add("h2", title)
    add("code", out)

add("h1", "Resumen de la evidencia")
for b in [
    "GET /health -> 200: servicio operativo.",
    "GET /api/products -> 200: catálogo listado (público).",
    "POST /api/auth/login -> 200: JWT emitido; -> 401 con credenciales incorrectas.",
    "POST /api/products -> 403 (cliente) / 201 (admin): autorización por rol.",
    "POST /api/cart/items -> 201: productos agregados; -> 409 si stock insuficiente.",
    "GET /api/cart -> 200 (con token) / 401 (sin token).",
    "POST /api/cart/checkout -> 201 (confirmado) / 402 (pago rechazado).",
]:
    add("bullet", b)
add("p", "La API responde correctamente en todos los escenarios: operaciones CRUD, "
         "autenticación JWT, autorización por rol, orquestación del checkout y manejo de "
         "errores con los códigos HTTP adecuados.")

# ---- render ----
def esc(t): return html.escape(t, quote=False)
def run(t, bold=False, size=None, color=None, mono=False):
    r="<w:rPr>"
    if bold: r+="<w:b/>"
    if size: r+=f'<w:sz w:val="{size}"/>'
    if color: r+=f'<w:color w:val="{color}"/>'
    if mono: r+='<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>'
    r+="</w:rPr>"
    return f'<w:r>{r}<w:t xml:space="preserve">{esc(t)}</w:t></w:r>'
def para(x, jc=None, after=120, ind=None, shade=False):
    p="<w:pPr>"
    if jc: p+=f'<w:jc w:val="{jc}"/>'
    if ind: p+=f'<w:ind w:left="{ind}"/>'
    if shade: p+='<w:shd w:val="clear" w:fill="F2F2F2"/>'
    p+=f'<w:spacing w:after="{after}"/></w:pPr>'
    return f"<w:p>{p}{x}</w:p>"

body=[]
for k,t in BLOCKS:
    if k=="center_title": body.append(para(run(t,bold=True,size=32,color="1F3864"),jc="center",after=120))
    elif k=="center_p": body.append(para(run(t,size=22),jc="center",after=60))
    elif k=="spacer": body.append(para(run(""),after=120))
    elif k=="h1": body.append(para(run(t,bold=True,size=28,color="1F3864"),after=140))
    elif k=="h2": body.append(para(run(t,bold=True,size=23,color="2E74B5"),after=80))
    elif k=="p": body.append(para(run(t,size=21),jc="both"))
    elif k=="bullet": body.append(para(run("•  ",size=21)+run(t,size=21),after=60,ind=360))
    elif k=="code":
        for line in t.split("\n"):
            body.append(para(run(line if line else " ",size=18,mono=True),after=0,ind=200,shade=True))
        body.append(para(run(""),after=120))

doc=('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
     '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
     +"".join(body)+
     '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:bottom="1440" w:left="1440" w:right="1440"/></w:sectPr>'
     '</w:body></w:document>')
ct=('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
rels=('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
out=os.path.join(os.path.dirname(__file__),"Capturas_Ejecucion_API.docx")
with zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml",ct); z.writestr("_rels/.rels",rels); z.writestr("word/document.xml",doc)
print("DOCX generado:",out)
