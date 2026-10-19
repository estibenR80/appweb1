'use strict';

/**
 * Tests de ENDPOINTS de la API con Supertest.
 * Prueba los servicios Express directamente (auth y catalog) sin levantar red,
 * cubriendo autenticación, autorización por rol y CRUD.
 */
const request = require('supertest');
const { getDb, resetDb } = require('../shared/db');

let authApp;
let catalogApp;

beforeEach(() => {
  resetDb();
  getDb();
  jest.resetModules();
  authApp = require('../services/auth/src/app');
  catalogApp = require('../services/catalog/src/app');
});

async function registerAndLogin(role = 'customer') {
  const email = `${role}@test.com`;
  await request(authApp)
    .post('/register')
    .send({ email, password: 'secret123', name: 'Test', role });
  const res = await request(authApp).post('/login').send({ email, password: 'secret123' });
  return res.body.token;
}

describe('API Auth endpoints', () => {
  test('POST /register devuelve 201', async () => {
    const res = await request(authApp)
      .post('/register')
      .send({ email: 'a@test.com', password: 'secret123', name: 'A' });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('a@test.com');
  });

  test('POST /login devuelve token y GET /me funciona', async () => {
    const token = await registerAndLogin('customer');
    const me = await request(authApp).get('/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('customer@test.com');
  });

  test('GET /me sin token devuelve 401', async () => {
    const res = await request(authApp).get('/me');
    expect(res.status).toBe(401);
  });
});

describe('API Catalog endpoints', () => {
  test('GET /products es público y devuelve lista', async () => {
    const res = await request(catalogApp).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /products sin rol admin devuelve 403', async () => {
    const token = await registerAndLogin('customer');
    const res = await request(catalogApp)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: 'X1', name: 'P', price_cents: 1000, stock: 1 });
    expect(res.status).toBe(403);
  });

  test('POST /products con admin crea el producto (201)', async () => {
    const token = await registerAndLogin('admin');
    const res = await request(catalogApp)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: 'X1', name: 'P', price_cents: 1000, stock: 5 });
    expect(res.status).toBe(201);
    expect(res.body.sku).toBe('X1');
  });

  test('flujo CRUD completo de producto', async () => {
    const token = await registerAndLogin('admin');
    const created = await request(catalogApp)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: 'X2', name: 'Prod', price_cents: 2000, stock: 10 });
    const id = created.body.id;

    const got = await request(catalogApp).get(`/products/${id}`);
    expect(got.status).toBe(200);

    const updated = await request(catalogApp)
      .put(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price_cents: 2500 });
    expect(updated.body.price_cents).toBe(2500);

    const deleted = await request(catalogApp)
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleted.status).toBe(204);
  });
});
