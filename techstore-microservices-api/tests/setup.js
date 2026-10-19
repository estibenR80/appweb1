'use strict';

// Fuerza el entorno de test: base de datos en memoria y logs silenciados.
process.env.NODE_ENV = 'test';
process.env.DB_FILE = ':memory:';
process.env.JWT_SECRET = 'test-secret';
process.env.LOG_LEVEL = 'error';
