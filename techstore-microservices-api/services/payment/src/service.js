'use strict';

/**
 * Lógica de negocio del servicio de pagos (pasarela SIMULADA).
 * En un entorno real aquí se integraría un proveedor (Stripe, PayU, Wompi...).
 * La simulación aprueba el pago salvo que la tarjeta termine en '0000',
 * lo que permite probar el flujo de rechazo de forma determinista.
 */
const crypto = require('crypto');
const { z } = require('zod');
const repo = require('./repository');
const { httpError } = require('../../../shared/appFactory');

const paymentSchema = z.object({
  order_id: z.number().int().positive(),
  amount_cents: z.number().int().positive(),
  method: z.enum(['credit_card', 'debit_card', 'paypal']),
  card_number: z.string().optional(),
});

function processPayment(input) {
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', 'Datos de pago inválidos');
  }
  const { order_id, amount_cents, method, card_number } = parsed.data;

  // Regla de simulación: tarjetas que terminan en 0000 son rechazadas.
  const declined = card_number && card_number.endsWith('0000');
  const status = declined ? 'declined' : 'approved';
  const transactionRef = 'txn_' + crypto.randomBytes(8).toString('hex');

  const payment = repo.create({
    orderId: order_id,
    amountCents: amount_cents,
    method,
    status,
    transactionRef: status === 'approved' ? transactionRef : null,
  });

  if (declined) {
    throw httpError(402, 'payment_declined', 'El pago fue rechazado por la pasarela');
  }
  return payment;
}

function getByOrder(orderId) {
  const payment = repo.findByOrder(orderId);
  if (!payment) throw httpError(404, 'not_found', 'Pago no encontrado');
  return payment;
}

module.exports = { processPayment, getByOrder };
