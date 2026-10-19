'use strict';

/**
 * Test de INTEGRACIÓN del checkout del carrito.
 * Mockea el cliente HTTP (axios) para simular las respuestas de los
 * servicios de catálogo, pago y envío, verificando la orquestación.
 */
const { getDb, resetDb } = require('../shared/db');

// Mock de axios para interceptar las llamadas entre servicios.
jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
  };
  return { create: jest.fn(() => instance), __instance: instance };
});

const axios = require('axios');
const mockHttp = axios.__instance;

let cartService;

beforeEach(() => {
  resetDb();
  getDb();
  jest.resetModules();
  mockHttp.get.mockReset();
  mockHttp.post.mockReset();
  cartService = require('../services/cart/src/service');
});

const user = { sub: 1, email: 'c@test.com', role: 'customer', name: 'Cliente' };

describe('Cart checkout - integración (orquestación de microservicios)', () => {
  test('agrega ítem consultando el catálogo', async () => {
    mockHttp.get.mockResolvedValueOnce({
      data: { id: 10, price_cents: 5000, stock: 20 },
    });
    const cart = await cartService.addItem(user.sub, { product_id: 10, quantity: 2 });
    expect(cart.items).toHaveLength(1);
    expect(cart.total_cents).toBe(10000);
  });

  test('checkout exitoso reserva stock, paga, genera envío y cierra el carrito', async () => {
    // addItem -> GET producto
    mockHttp.get.mockResolvedValueOnce({ data: { id: 10, price_cents: 5000, stock: 20 } });
    await cartService.addItem(user.sub, { product_id: 10, quantity: 2 });

    // checkout -> POST reserve-stock, POST payment, POST shipment
    mockHttp.post
      .mockResolvedValueOnce({ data: { reserved: true } }) // reserve-stock
      .mockResolvedValueOnce({ data: { id: 1, status: 'approved', transaction_ref: 'txn_x' } }) // payment
      .mockResolvedValueOnce({ data: { id: 1, tracking_code: 'TRK-ABC', carrier: 'Servientrega' } }); // shipment

    const result = await cartService.checkout(
      user,
      { payment_method: 'credit_card', card_number: '4111111111111234', address: 'Calle 1 # 2-3' },
      {}
    );

    expect(result.order.status).toBe('confirmed');
    expect(result.payment.status).toBe('approved');
    expect(result.shipment.tracking_code).toBe('TRK-ABC');
    expect(result.total_cents).toBe(10000);

    // El carrito quedó cerrado: un nuevo getCart crea uno vacío.
    const newCart = cartService.getCart(user.sub);
    expect(newCart.items).toHaveLength(0);
  });

  test('checkout con carrito vacío lanza error', async () => {
    await expect(
      cartService.checkout(user, { payment_method: 'paypal', address: 'Calle 1 # 2-3' }, {})
    ).rejects.toThrow(/carrito/i);
  });

  test('checkout propaga fallo de pago', async () => {
    mockHttp.get.mockResolvedValueOnce({ data: { id: 10, price_cents: 5000, stock: 20 } });
    await cartService.addItem(user.sub, { product_id: 10, quantity: 1 });

    mockHttp.post
      .mockResolvedValueOnce({ data: { reserved: true } }) // reserve-stock
      .mockRejectedValueOnce(new Error('declined')); // payment falla

    await expect(
      cartService.checkout(
        user,
        { payment_method: 'credit_card', card_number: '4111111111110000', address: 'Calle 1 # 2-3' },
        {}
      )
    ).rejects.toThrow(/pago fue rechazado/);
  });
});
