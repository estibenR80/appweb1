'use strict';

/**
 * Lógica de negocio del servicio de envíos.
 * Genera una guía de envío con transportadora y código de rastreo.
 */
const crypto = require('crypto');
const { z } = require('zod');
const repo = require('./repository');
const { httpError } = require('../../../shared/appFactory');

const shipmentSchema = z.object({
  order_id: z.number().int().positive(),
  address: z.string().min(5),
});

const CARRIERS = ['Servientrega', 'Coordinadora', 'Interrapidísimo'];

function createShipment(input) {
  const parsed = shipmentSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', 'Datos de envío inválidos');
  }
  const carrier = CARRIERS[Math.floor(Math.random() * CARRIERS.length)];
  const trackingCode = 'TRK-' + crypto.randomBytes(6).toString('hex').toUpperCase();
  return repo.create({
    orderId: parsed.data.order_id,
    address: parsed.data.address,
    carrier,
    trackingCode,
    status: 'pending',
  });
}

function getByOrder(orderId) {
  const shipment = repo.findByOrder(orderId);
  if (!shipment) throw httpError(404, 'not_found', 'Envío no encontrado');
  return shipment;
}

module.exports = { createShipment, getByOrder };
