'use strict';

/** Rutas del servicio de carrito. Todas requieren autenticación. */
const { authMiddleware } = require('../../../shared/auth');
const { forwardAuthHeaders } = require('../../../shared/httpClient');
const service = require('./service');

function registerRoutes(app) {
  app.use(authMiddleware);

  app.get('/cart', (req, res, next) => {
    try {
      res.json(service.getCart(req.user.sub));
    } catch (err) {
      next(err);
    }
  });

  app.post('/cart/items', async (req, res, next) => {
    try {
      res.status(201).json(await service.addItem(req.user.sub, req.body));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/cart/items/:id', (req, res, next) => {
    try {
      res.json(service.removeItem(req.user.sub, Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  });

  app.post('/cart/checkout', async (req, res, next) => {
    try {
      const result = await service.checkout(req.user, req.body, forwardAuthHeaders(req));
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { registerRoutes };
