'use strict';

/** Tests de la LÓGICA DE NEGOCIO del servicio de autenticación. */
const { getDb, resetDb } = require('../shared/db');
const authService = require('../services/auth/src/service');
const { verifyToken } = require('../shared/auth');

beforeEach(() => {
  resetDb();
  getDb(); // recrea el esquema en memoria
});

describe('Auth service - lógica de negocio', () => {
  test('registra un usuario y no expone el hash de la contraseña', () => {
    const user = authService.register({
      email: 'nuevo@test.com',
      password: 'secret123',
      name: 'Nuevo Usuario',
    });
    expect(user).toMatchObject({ email: 'nuevo@test.com', role: 'customer' });
    expect(user.password_hash).toBeUndefined();
  });

  test('rechaza registro con correo duplicado', () => {
    authService.register({ email: 'dup@test.com', password: 'secret123', name: 'Uno' });
    expect(() =>
      authService.register({ email: 'dup@test.com', password: 'secret123', name: 'Dos' })
    ).toThrow(/ya está registrado/);
  });

  test('rechaza registro con datos inválidos', () => {
    expect(() =>
      authService.register({ email: 'no-es-email', password: '123', name: 'X' })
    ).toThrow(/validation|inválid/i);
  });

  test('login devuelve un JWT válido con el rol correcto', () => {
    authService.register({
      email: 'login@test.com',
      password: 'secret123',
      name: 'Login',
      role: 'admin',
    });
    const result = authService.login({ email: 'login@test.com', password: 'secret123' });
    expect(result.token).toBeDefined();
    const payload = verifyToken(result.token);
    expect(payload.email).toBe('login@test.com');
    expect(payload.role).toBe('admin');
  });

  test('login falla con contraseña incorrecta', () => {
    authService.register({ email: 'bad@test.com', password: 'secret123', name: 'Bad' });
    expect(() => authService.login({ email: 'bad@test.com', password: 'wrong' })).toThrow(
      /incorrectos/
    );
  });
});
