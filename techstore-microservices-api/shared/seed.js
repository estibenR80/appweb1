'use strict';

/**
 * Script de inicialización de datos (seed).
 * Crea el esquema (vía db.js) y puebla usuarios y productos de ejemplo.
 */
const bcrypt = require('bcryptjs');
const { getDb } = require('./db');

function seed() {
  const db = getDb();

  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const insert = db.prepare(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
    );
    insert.run('admin@techstore.com', bcrypt.hashSync('admin123', 10), 'Administrador', 'admin');
    insert.run('cliente@techstore.com', bcrypt.hashSync('cliente123', 10), 'Cliente Demo', 'customer');
  }

  const productCount = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  if (productCount === 0) {
    const insert = db.prepare(
      `INSERT INTO products (sku, name, description, price_cents, stock, category)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const products = [
      ['SKU-001', 'Teclado mecánico RGB', 'Teclado mecánico con switches azules', 129900, 25, 'perifericos'],
      ['SKU-002', 'Mouse inalámbrico', 'Mouse ergonómico 2.4GHz', 59900, 40, 'perifericos'],
      ['SKU-003', 'Monitor 27" 144Hz', 'Monitor QHD para gaming', 899900, 10, 'monitores'],
      ['SKU-004', 'Auriculares con micrófono', 'Headset estéreo USB', 149900, 30, 'audio'],
      ['SKU-005', 'Webcam Full HD', 'Cámara 1080p con autoenfoque', 99900, 15, 'perifericos'],
    ];
    const tx = db.transaction((rows) => rows.forEach((r) => insert.run(...r)));
    tx(products);
  }

  console.log('Seed completado: usuarios y productos de ejemplo creados.');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
