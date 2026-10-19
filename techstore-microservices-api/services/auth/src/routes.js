'use strict';

/** Rutas (endpoints) del servicio de autenticación. */
const { authMiddleware } = require('../../../shared/auth');
const service = require('./service');

function registerRoutes(app) {
  app.post('/register', (req, res, next) => {
    try {
      res.status(201).json(service.register(req.body));
    } catch (err) {
      next(err);
    }
  });

  app.post('/login', (req, res, next) => {
    try {
      res.json(service.login(req.body));
    } catch (err) {
      next(err);
    }
  });

  app.get('/me', authMiddleware, (req, res, next) => {
    try {
      res.json(service.me(req.user.sub));
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { registerRoutes };
