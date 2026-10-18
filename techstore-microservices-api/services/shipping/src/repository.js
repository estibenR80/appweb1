'use strict';

/** Repositorio de envíos (tabla `shipments`). */
const { getDb } = require('../../../shared/db');

function create(s) {
  const info = getDb()
    .prepare(
      `INSERT INTO shipments (order_id, address, carrier, tracking_code, status)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(s.orderId, s.address, s.carrier, s.trackingCode, s.status);
  return getDb().prepare('SELECT * FROM shipments WHERE id = ?').get(info.lastInsertRowid);
}

function findByOrder(orderId) {
  return getDb().prepare('SELECT * FROM shipments WHERE order_id = ?').get(orderId);
}

module.exports = { create, findByOrder };
