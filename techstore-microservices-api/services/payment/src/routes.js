'use strict';

/** Rutas del servicio de pagos. */
const { authMiddleware } = require('../../../shared/auth');
const service = require('./service');

function registerRoutes(app) {
  app.post('/payments', authMiddleware, (req, res, next) => {
    try {
      res.status(201).json(service.processPayment(req.body));
    } catch (err) {
      next(err);
    }
  });

  app.get('/payments/order/:orderId', authMiddleware, (req, res, next) => {
    try {
      res.json(service.getByOrder(Number(req.params.orderId)));
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { registerRoutes };
