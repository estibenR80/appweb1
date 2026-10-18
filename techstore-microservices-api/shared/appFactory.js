'use strict';

/**
 * Fábrica de aplicaciones Express con configuración común a todos los
 * microservicios: JSON parsing, CORS, logging de peticiones, métricas,
 * endpoints /health y /metrics, y manejador de errores centralizado.
 */
const express = require('express');
const cors = require('cors');
const { createLogger } = require('./logger');
const { buildMetrics } = require('./metrics');

function createApp(serviceName, registerRoutes) {
  const app = express();
  const logger = createLogger(serviceName);
  const metrics = buildMetrics(serviceName);

  app.use(express.json());
  app.use(cors());
  app.use(metrics.middleware);

  // Log estructurado de cada petición.
  app.use((req, res, next) => {
    res.on('finish', () => {
      logger.info('request', {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
      });
    });
    next();
  });

  // Health check (liveness/readiness).
  app.get('/health', (req, res) => res.json({ status: 'ok', service: serviceName }));

  // Métricas Prometheus.
  app.get('/metrics', metrics.handler);

  // Rutas específicas del servicio.
  registerRoutes(app, { logger });

  // 404.
  app.use((req, res) => {
    res.status(404).json({ error: 'not_found', message: 'Recurso no encontrado' });
  });

  // Manejador de errores centralizado.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status >= 500) logger.error('unhandled_error', { message: err.message, stack: err.stack });
    res.status(status).json({
      error: err.code || 'internal_error',
      message: err.expose ? err.message : status >= 500 ? 'Error interno del servidor' : err.message,
    });
  });

  app.locals.logger = logger;
  return app;
}

/** Helper para crear errores HTTP con mensaje expuesto al cliente. */
function httpError(status, code, message) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  err.expose = true;
  return err;
}

module.exports = { createApp, httpError };
