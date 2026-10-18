'use strict';

/** Rutas del servicio de envíos. */
const { authMiddleware } = require('../../../shared/auth');
const service = require('./service');

function registerRoutes(app) {
  app.post('/shipments', authMiddleware, (req, res, next) => {
    try {
      res.status(201).json(service.createShipment(req.body));
    } catch (err) {
      next(err);
    }
  });

  app.get('/shipments/order/:orderId', authMiddleware, (req, res, next) => {
    try {
      res.json(service.getByOrder(Number(req.params.orderId)));
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { registerRoutes };
