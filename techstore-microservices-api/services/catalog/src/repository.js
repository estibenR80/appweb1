'use strict';

/** Repositorio de productos e inventario (tabla `products`). */
const { getDb } = require('../../../shared/db');

function list({ category, q, limit = 50, offset = 0 } = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM products WHERE active = 1';
  const params = [];
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (q) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  sql += ' ORDER BY id LIMIT ? OFFSET ?';
  params.push(limit, offset);
  return db.prepare(sql).all(...params);
}

function findById(id) {
  return getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
}

function findBySku(sku) {
  return getDb().prepare('SELECT * FROM products WHERE sku = ?').get(sku);
}

function create(p) {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO products (sku, name, description, price_cents, stock, category, active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`
    )
    .run(p.sku, p.name, p.description || null, p.price_cents, p.stock, p.category || null);
  return findById(info.lastInsertRowid);
}

function update(id, p) {
  const db = getDb();
  db.prepare(
    `UPDATE products SET name = ?, description = ?, price_cents = ?, stock = ?, category = ?, active = ?
     WHERE id = ?`
  ).run(p.name, p.description, p.price_cents, p.stock, p.category, p.active, id);
  return findById(id);
}

function remove(id) {
  // Borrado lógico para preservar integridad referencial con pedidos.
  getDb().prepare('UPDATE products SET active = 0 WHERE id = ?').run(id);
}

/** Descuenta stock de forma atómica; devuelve true si había suficiente. */
function decrementStock(id, quantity) {
  const info = getDb()
    .prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')
    .run(quantity, id, quantity);
  return info.changes === 1;
}

module.exports = { list, findById, findBySku, create, update, remove, decrementStock };
