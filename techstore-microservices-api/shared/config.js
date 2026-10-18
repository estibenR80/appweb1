'use strict';

/**
 * Configuración centralizada basada en variables de entorno.
 * Permite 12-factor config y desacoplar valores sensibles del código.
 */
const path = require('path');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'techstore-dev-secret-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
  db: {
    // En tests se usa una base en memoria; en el resto, un archivo persistente.
    file:
      process.env.DB_FILE ||
      (process.env.NODE_ENV === 'test'
        ? ':memory:'
        : path.join(__dirname, '..', 'data', 'techstore.db')),
  },
  ports: {
    gateway: Number(process.env.GATEWAY_PORT) || 8080,
    auth: Number(process.env.AUTH_PORT) || 3001,
    catalog: Number(process.env.CATALOG_PORT) || 3002,
    cart: Number(process.env.CART_PORT) || 3003,
    payment: Number(process.env.PAYMENT_PORT) || 3004,
    shipping: Number(process.env.SHIPPING_PORT) || 3005,
  },
  // URLs internas de los servicios (usadas por el gateway y entre servicios).
  services: {
    auth: process.env.AUTH_URL || 'http://localhost:3001',
    catalog: process.env.CATALOG_URL || 'http://localhost:3002',
    cart: process.env.CART_URL || 'http://localhost:3003',
    payment: process.env.PAYMENT_URL || 'http://localhost:3004',
    shipping: process.env.SHIPPING_URL || 'http://localhost:3005',
  },
};
