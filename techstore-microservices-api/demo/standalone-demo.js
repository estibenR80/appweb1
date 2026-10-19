'use strict';

/**
 * SERVIDOR DE DEMOSTRACIÓN AUTOCONTENIDO (solo módulos nativos de Node).
 *
 * Replica el comportamiento de la API de microservicios TechStore para poder
 * ejecutarla y capturar evidencia en un entorno SIN acceso a npm.
 * Usa el módulo http nativo, un JWT firmado con crypto (HMAC-SHA256) y un
 * almacén de datos en memoria. La lógica de negocio (auth, catálogo, carrito,
 * checkout con pago y envío) es equivalente a la del proyecto real.
 *
 * NOTA: en producción se usan Express + better-sqlite3 + jsonwebtoken, tal como
 * está implementado en services/ y shared/. Este archivo es solo para la demo.
 */
const http = require('http');
const crypto = require('crypto');

const PORT = process.env.DEMO_PORT || 8080;
const SECRET = 'demo-secret';

// ---------------------------------------------------------------------------
// Almacén en memoria (equivalente a las tablas SQLite del proyecto real).
// ---------------------------------------------------------------------------
const db = {
  users: [],
  products: [],
  carts: {}, // userId -> { items: [{product_id, quantity, unit_price_cents}] }
  orders: [],
  seq: { user: 0, product: 0, order: 0 },
};

function hash(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function seed() {
  db.users.push({ id: ++db.seq.user, email: 'admin@techstore.com', password: hash('admin123'), name: 'Administrador', role: 'admin' });
  db.users.push({ id: ++db.seq.user, email: 'cliente@techstore.com', password: hash('cliente123'), name: 'Cliente Demo', role: 'customer' });
  const prods = [
    ['SKU-001', 'Teclado mecánico RGB', 129900, 25, 'perifericos'],
    ['SKU-002', 'Mouse inalámbrico', 59900, 40, 'perifericos'],
    ['SKU-003', 'Monitor 27" 144Hz', 899900, 10, 'monitores'],
    ['SKU-004', 'Auriculares con micrófono', 149900, 30, 'audio'],
    ['SKU-005', 'Webcam Full HD', 99900, 15, 'perifericos'],
  ];
  for (const [sku, name, price, stock, category] of prods) {
    db.products.push({ id: ++db.seq.product, sku, name, price_cents: price, stock, category, active: 1 });
  }
}

// ---------------------------------------------------------------------------
// JWT minimalista (HMAC-SHA256) — mismo esquema conceptual que jsonwebtoken.
// ---------------------------------------------------------------------------
function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}
function signToken(payload) {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const body = b64url({ ...payload, iat: Math.floor(Date.now() / 1000) });
  const sig = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}
function verifyToken(token) {
  const [h, b, s] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(`${h}.${b}`).digest('base64url');
  if (s !== expected) throw new Error('invalid');
  return JSON.parse(Buffer.from(b, 'base64url').toString());
}

// ---------------------------------------------------------------------------
// Utilidades HTTP
// ---------------------------------------------------------------------------
function send(res, status, body) {
  const data = JSON.stringify(body, null, 2);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(data);
}
function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => resolve(raw ? JSON.parse(raw) : {}));
  });
}
function getUser(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try {
    return verifyToken(h.slice(7));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  try {
    // Health
    if (path === '/health') return send(res, 200, { status: 'ok', service: 'techstore-demo' });

    // Auth - login
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = await readBody(req);
      const user = db.users.find((u) => u.email === email && u.password === hash(password || ''));
      if (!user) return send(res, 401, { error: 'unauthorized', message: 'Correo o contraseña incorrectos' });
      return send(res, 200, {
        token: signToken({ sub: user.id, email: user.email, role: user.role, name: user.name }),
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    }

    // Auth - register
    if (path === '/api/auth/register' && method === 'POST') {
      const { email, password, name, role } = await readBody(req);
      if (db.users.find((u) => u.email === email)) return send(res, 409, { error: 'conflict', message: 'El correo ya está registrado' });
      const user = { id: ++db.seq.user, email, password: hash(password), name, role: role || 'customer' };
      db.users.push(user);
      return send(res, 201, { id: user.id, email: user.email, name: user.name, role: user.role });
    }

    // Catalog - list
    if (path === '/api/products' && method === 'GET') {
      return send(res, 200, db.products.filter((p) => p.active));
    }
    // Catalog - detail
    const prodMatch = path.match(/^\/api\/products\/(\d+)$/);
    if (prodMatch && method === 'GET') {
      const p = db.products.find((x) => x.id === Number(prodMatch[1]) && x.active);
      if (!p) return send(res, 404, { error: 'not_found', message: 'Producto no encontrado' });
      return send(res, 200, p);
    }
    // Catalog - create (admin)
    if (path === '/api/products' && method === 'POST') {
      const user = getUser(req);
      if (!user) return send(res, 401, { error: 'unauthorized', message: 'Token no proporcionado' });
      if (user.role !== 'admin') return send(res, 403, { error: 'forbidden', message: 'Se requiere el rol: admin' });
      const b = await readBody(req);
      const p = { id: ++db.seq.product, sku: b.sku, name: b.name, price_cents: b.price_cents, stock: b.stock, category: b.category, active: 1 };
      db.products.push(p);
      return send(res, 201, p);
    }

    // Cart - view
    if (path === '/api/cart' && method === 'GET') {
      const user = getUser(req);
      if (!user) return send(res, 401, { error: 'unauthorized', message: 'Token no proporcionado' });
      const cart = db.carts[user.sub] || { items: [] };
      const total = cart.items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
      return send(res, 200, { items: cart.items, total_cents: total });
    }
    // Cart - add item
    if (path === '/api/cart/items' && method === 'POST') {
      const user = getUser(req);
      if (!user) return send(res, 401, { error: 'unauthorized', message: 'Token no proporcionado' });
      const { product_id, quantity } = await readBody(req);
      const product = db.products.find((p) => p.id === product_id && p.active);
      if (!product) return send(res, 404, { error: 'not_found', message: 'Producto no encontrado en el catálogo' });
      if (product.stock < quantity) return send(res, 409, { error: 'out_of_stock', message: 'Stock insuficiente' });
      const cart = (db.carts[user.sub] = db.carts[user.sub] || { items: [] });
      const existing = cart.items.find((i) => i.product_id === product_id);
      if (existing) existing.quantity += quantity;
      else cart.items.push({ product_id, quantity, unit_price_cents: product.price_cents });
      const total = cart.items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
      return send(res, 201, { items: cart.items, total_cents: total });
    }
    // Cart - checkout (orquesta inventario + pago + envío)
    if (path === '/api/cart/checkout' && method === 'POST') {
      const user = getUser(req);
      if (!user) return send(res, 401, { error: 'unauthorized', message: 'Token no proporcionado' });
      const { payment_method, card_number, address } = await readBody(req);
      const cart = db.carts[user.sub];
      if (!cart || cart.items.length === 0) return send(res, 400, { error: 'empty_cart', message: 'El carrito está vacío' });
      const total = cart.items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
      // 1) Reserva de stock (inventario)
      for (const i of cart.items) {
        const p = db.products.find((x) => x.id === i.product_id);
        if (p.stock < i.quantity) return send(res, 409, { error: 'out_of_stock', message: `Sin stock para ${p.name}` });
      }
      cart.items.forEach((i) => { db.products.find((x) => x.id === i.product_id).stock -= i.quantity; });
      // 2) Pedido
      const order = { id: ++db.seq.order, user_id: user.sub, total_cents: total, status: 'created' };
      db.orders.push(order);
      // 3) Pago (rechaza si la tarjeta termina en 0000)
      if (card_number && card_number.endsWith('0000')) {
        order.status = 'payment_failed';
        return send(res, 402, { error: 'payment_failed', message: 'El pago fue rechazado' });
      }
      const payment = { id: order.id, status: 'approved', method: payment_method, transaction_ref: 'txn_' + crypto.randomBytes(6).toString('hex') };
      // 4) Envío
      const carriers = ['Servientrega', 'Coordinadora', 'Interrapidísimo'];
      const shipment = { id: order.id, address, carrier: carriers[Math.floor(Math.random() * 3)], tracking_code: 'TRK-' + crypto.randomBytes(4).toString('hex').toUpperCase(), status: 'pending' };
      // 5) Confirma y vacía el carrito
      order.status = 'confirmed';
      db.carts[user.sub] = { items: [] };
      return send(res, 201, { order, payment, shipment, total_cents: total });
    }

    return send(res, 404, { error: 'not_found', message: 'Recurso no encontrado' });
  } catch (err) {
    return send(res, 500, { error: 'internal_error', message: err.message });
  }
});

seed();
server.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'info', service: 'techstore-demo', message: 'gateway_started', port: PORT, docs: '/docs (en el proyecto real con Swagger)' }));
});

module.exports = server;
