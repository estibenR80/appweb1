'use strict';

/** Rutas del servicio de catálogo e inventario. */
const { authMiddleware, requireRole } = require('../../../shared/auth');
const service = require('./service');

function registerRoutes(app) {
  // Lectura pública del catálogo.
  app.get('/products', (req, res, next) => {
    try {
      res.json(service.listProducts(req.query));
    } catch (err) {
      next(err);
    }
  });

  app.get('/products/:id', (req, res, next) => {
    try {
      res.json(service.getProduct(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  });

  // Escritura solo para administradores.
  app.post('/products', authMiddleware, requireRole('admin'), (req, res, next) => {
    try {
      res.status(201).json(service.createProduct(req.body));
    } catch (err) {
      next(err);
    }
  });

  app.put('/products/:id', authMiddleware, requireRole('admin'), (req, res, next) => {
    try {
      res.json(service.updateProduct(Number(req.params.id), req.body));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/products/:id', authMiddleware, requireRole('admin'), (req, res, next) => {
    try {
      service.deleteProduct(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Endpoint interno usado por el carrito para reservar stock durante el checkout.
  app.post('/internal/reserve-stock', (req, res, next) => {
    try {
      service.reserveStock(req.body.items || []);
      res.json({ reserved: true });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { registerRoutes };
