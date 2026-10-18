'use strict';

/**
 * Utilidades de autenticación/autorización basadas en JWT.
 * - signToken: firma un token con los datos del usuario.
 * - verifyToken: valida un token y devuelve su payload.
 * - authMiddleware: protege rutas Express exigiendo un JWT válido.
 * - requireRole: autorización por rol (p. ej. 'admin').
 */
const jwt = require('jsonwebtoken');
const config = require('./config');

function signToken(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function authMiddleware(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'unauthorized', message: 'Token no proporcionado' });
  }
  try {
    req.user = verifyToken(token);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized', message: 'Token inválido o expirado' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ error: 'forbidden', message: `Se requiere el rol: ${role}` });
    }
    return next();
  };
}

module.exports = { signToken, verifyToken, authMiddleware, requireRole };
