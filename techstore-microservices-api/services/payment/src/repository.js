'use strict';

/** Repositorio de pagos (tabla `payments`). */
const { getDb } = require('../../../shared/db');

function create(p) {
  const info = getDb()
    .prepare(
      `INSERT INTO payments (order_id, amount_cents, method, status, transaction_ref)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(p.orderId, p.amountCents, p.method, p.status, p.transactionRef);
  return getDb().prepare('SELECT * FROM payments WHERE id = ?').get(info.lastInsertRowid);
}

function findByOrder(orderId) {
  return getDb().prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId);
}

module.exports = { create, findByOrder };
