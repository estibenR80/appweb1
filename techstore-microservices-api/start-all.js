'use strict';

/**
 * Lanzador local: arranca todos los microservicios y el gateway en un
 * solo comando (cada uno en su propio proceso hijo). Útil para desarrollo
 * sin Docker. En producción cada servicio se despliega por separado.
 */
const { spawn } = require('child_process');
const path = require('path');

const services = [
  'services/auth/src/server.js',
  'services/catalog/src/server.js',
  'services/cart/src/server.js',
  'services/payment/src/server.js',
  'services/shipping/src/server.js',
  'gateway/src/server.js',
];

const children = services.map((s) => {
  const child = spawn('node', [path.join(__dirname, s)], { stdio: 'inherit' });
  child.on('exit', (code) => {
    console.error(`El servicio ${s} terminó con código ${code}`);
  });
  return child;
});

function shutdown() {
  children.forEach((c) => c.kill('SIGTERM'));
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
