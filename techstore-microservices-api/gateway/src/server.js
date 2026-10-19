'use strict';

/**
 * API Gateway (Servicio de API).
 * Punto único de entrada: enruta las peticiones a los microservicios,
 * aplica rate limiting, expone la documentación OpenAPI y centraliza /health.
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('../../shared/config');
const { createLogger } = require('../../shared/logger');
const { buildMetrics } = require('../../shared/metrics');

const logger = createLogger('api-gateway');
const metrics = buildMetrics('api-gateway');
const app = express();

app.use(cors());
app.use(metrics.middleware);

// Límite de tasa: protege la API frente a abuso (atributo de calidad: seguridad/fiabilidad).
const limiter = rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true });
app.use('/api', limiter);

// Health y métricas del gateway.
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));
app.get('/metrics', metrics.handler);

// Documentación interactiva de la API (contrato OpenAPI).
try {
  const openapiDoc = YAML.load(path.join(__dirname, '..', '..', 'openapi', 'techstore.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
} catch (err) {
  logger.warn('openapi_not_loaded', { message: err.message });
}

// Reglas de enrutamiento hacia cada microservicio.
// Nota: se reescribe el prefijo /api/<servicio> al path interno del servicio.
const routes = [
  { path: '/api/auth', target: config.services.auth, rewrite: { '^/api/auth': '' } },
  { path: '/api/products', target: config.services.catalog, rewrite: { '^/api': '' } },
  { path: '/api/cart', target: config.services.cart, rewrite: { '^/api': '' } },
  { path: '/api/payments', target: config.services.payment, rewrite: { '^/api': '' } },
  { path: '/api/shipping', target: config.services.shipping, rewrite: { '^/api/shipping': '/shipments' } },
];

for (const r of routes) {
  app.use(
    r.path,
    createProxyMiddleware({
      target: r.target,
      changeOrigin: true,
      pathRewrite: r.rewrite,
      logLevel: 'silent',
      onError: (err, req, res) => {
        logger.error('proxy_error', { target: r.target, message: err.message });
        res.status(502).json({ error: 'bad_gateway', message: 'Servicio no disponible' });
      },
    })
  );
}

app.use((req, res) => res.status(404).json({ error: 'not_found' }));

if (require.main === module) {
  app.listen(config.ports.gateway, () => {
    logger.info('gateway_started', { port: config.ports.gateway, docs: '/docs' });
  });
}

module.exports = app;
