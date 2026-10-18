'use strict';

/**
 * Lógica de negocio del servicio de autenticación:
 * registro de usuarios (con hash de contraseña) y login (emisión de JWT).
 */
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const repo = require('./repository');
const { signToken } = require('../../../shared/auth');
const { httpError } = require('../../../shared/appFactory');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['customer', 'admin']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function sanitize(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function register(input) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', parsed.error.issues.map((i) => i.message).join(', '));
  }
  const { email, password, name, role } = parsed.data;
  if (repo.findByEmail(email)) {
    throw httpError(409, 'conflict', 'El correo ya está registrado');
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = repo.createUser({ email, passwordHash, name, role: role || 'customer' });
  return sanitize(user);
}

function login(input) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', 'Credenciales inválidas');
  }
  const { email, password } = parsed.data;
  const user = repo.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw httpError(401, 'unauthorized', 'Correo o contraseña incorrectos');
  }
  const token = signToken({ sub: user.id, email: user.email, role: user.role, name: user.name });
  return { token, user: sanitize(user) };
}

function me(userId) {
  const user = repo.findById(userId);
  if (!user) throw httpError(404, 'not_found', 'Usuario no encontrado');
  return sanitize(user);
}

module.exports = { register, login, me, sanitize };
