'use strict';

/** Tests de la LÓGICA DE NEGOCIO del servicio de pagos (simulado). */
const { getDb, resetDb } = require('../shared/db');
const payment = require('../services/payment/src/service');

beforeEach(() => {
  resetDb();
  getDb();
});

describe('Payment service - lógica de negocio', () => {
  test('aprueba un pago válido y genera referencia de transacción', () => {
    const result = payment.processPayment({
      order_id: 1,
      amount_cents: 5000,
      method: 'credit_card',
      card_number: '4111111111111234',
    });
    expect(result.status).toBe('approved');
    expect(result.transaction_ref).toMatch(/^txn_/);
  });

  test('rechaza tarjetas que terminan en 0000', () => {
    expect(() =>
      payment.processPayment({
        order_id: 1,
        amount_cents: 5000,
        method: 'credit_card',
        card_number: '4111111111110000',
      })
    ).toThrow(/rechazado/);
  });

  test('valida datos de pago', () => {
    expect(() => payment.processPayment({ order_id: 1, amount_cents: -5, method: 'paypal' })).toThrow(
      /inválidos/
    );
  });
});
