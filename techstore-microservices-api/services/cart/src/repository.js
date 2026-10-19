'use strict';

/** Repositorio del carrito, ítems y pedidos. */
const { getDb } = require('../../../shared/db');

function getOpenCart(userId) {
  return getDb()
    .prepare("SELECT * FROM carts WHERE user_id = ? AND status = 'open'")
    .get(userId);
}

function createCart(userId) {
  const info = getDb().prepare('INSERT INTO carts (user_id) VALUES (?)').run(userId);
  return getDb().prepare('SELECT * FROM carts WHERE id = ?').get(info.lastInsertRowid);
}

function getOrCreateOpenCart(userId) {
  return getOpenCart(userId) || createCart(userId);
}

function getItems(cartId) {
  return getDb().prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cartId);
}

function findItem(cartId, productId) {
  return getDb()
    .prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?')
    .get(cartId, productId);
}

function addItem({ cartId, productId, quantity, unitPriceCents }) {
  const existing = findItem(cartId, productId);
  if (existing) {
    getDb()
      .prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?')
      .run(quantity, existing.id);
    return getDb().prepare('SELECT * FROM cart_items WHERE id = ?').get(existing.id);
  }
  const info = getDb()
    .prepare(
      'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)'
    )
    .run(cartId, productId, quantity, unitPriceCents);
  return getDb().prepare('SELECT * FROM cart_items WHERE id = ?').get(info.lastInsertRowid);
}

function removeItem(cartId, itemId) {
  return getDb()
    .prepare('DELETE FROM cart_items WHERE id = ? AND cart_id = ?')
    .run(itemId, cartId);
}

function closeCart(cartId) {
  getDb().prepare("UPDATE carts SET status = 'closed' WHERE id = ?").run(cartId);
}

function createOrder({ userId, cartId, totalCents }) {
  const info = getDb()
    .prepare('INSERT INTO orders (user_id, cart_id, total_cents, status) VALUES (?, ?, ?, ?)')
    .run(userId, cartId, totalCents, 'created');
  return getDb().prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
}

function updateOrderStatus(orderId, status) {
  getDb().prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
}

module.exports = {
  getOpenCart,
  getOrCreateOpenCart,
  getItems,
  addItem,
  removeItem,
  closeCart,
  createOrder,
  updateOrderStatus,
};
