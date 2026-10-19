'use strict';

/**
 * Logger estructurado (JSON) con Winston.
 * Buenas prácticas: logs centralizados, con nivel, timestamp y nombre del servicio.
 */
const winston = require('winston');

function createLogger(serviceName) {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'test' ? 'error' : 'info'),
    defaultMeta: { service: serviceName },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()],
  });
}

module.exports = { createLogger };
