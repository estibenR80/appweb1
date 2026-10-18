'use strict';

/**
 * Métricas de observabilidad en formato Prometheus (prom-client).
 * Expone contador de peticiones HTTP e histograma de latencia por servicio.
 */
const client = require('prom-client');

function buildMetrics(serviceName) {
  const registry = new client.Registry();
  registry.setDefaultLabels({ service: serviceName });
  client.collectDefaultMetrics({ register: registry });

  const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Número total de peticiones HTTP',
    labelNames: ['method', 'route', 'status'],
    registers: [registry],
  });

  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duración de las peticiones HTTP en segundos',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [registry],
  });

  // Middleware Express que mide cada petición.
  function middleware(req, res, next) {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
      const route = req.route ? req.baseUrl + req.route.path : req.path;
      const labels = { method: req.method, route, status: res.statusCode };
      httpRequestsTotal.inc(labels);
      end(labels);
    });
    next();
  }

  // Handler del endpoint /metrics.
  async function handler(req, res) {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
  }

  return { registry, middleware, handler };
}

module.exports = { buildMetrics };
