'use strict';

/**
 * Lógica de negocio del carrito y del proceso de checkout.
 * El checkout ORQUESTA la comunicación con los servicios de catálogo
 * (reserva de stock), pago y envío. Esto ilustra la coordinación entre
 * microservicios en una transacción de negocio.
 */
const { z } = require('zod');
const repo = require('./repository');
const { httpError } = require('../../../shared/appFactory');
const { createClient } = require('../../../shared/httpClient');
const config = require('../../../shared/config');

const catalogClient = createClient(config.services.catalog);
const paymentClient = createClient(config.services.payment);
const shippingClient = createClient(config.services.shipping);

const addItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  payment_method: z.enum(['credit_card', 'debit_card', 'paypal']),
  card_number: z.string().optional(),
  address: z.string().min(5),
});

function buildCartView(cart) {
  const items = repo.getItems(cart.id);
  const total = items.reduce((sum, i) => sum + i.unit_price_cents * i.quantity, 0);
  return { id: cart.id, status: cart.status, items, total_cents: total };
}

function getCart(userId) {
  const cart = repo.getOrCreateOpenCart(userId);
  return buildCartView(cart);
}

async function addItem(userId, input) {
  const parsed = addItemSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', 'Datos del ítem inválidos');
  }
  const { product_id, quantity } = parsed.data;

  // Consulta el producto en el servicio de catálogo.
  let product;
  try {
    const { data } = await catalogClient.get(`/products/${product_id}`);
    product = data;
  } catch (err) {
    throw httpError(404, 'not_found', 'Producto no encontrado en el catálogo');
  }
  if (product.stock < quantity) {
    throw httpError(409, 'out_of_stock', 'Stock insuficiente');
  }

  const cart = repo.getOrCreateOpenCart(userId);
  repo.addItem({
    cartId: cart.id,
    productId: product_id,
    quantity,
    unitPriceCents: product.price_cents,
  });
  return buildCartView(cart);
}

function removeItem(userId, itemId) {
  const cart = repo.getOpenCart(userId);
  if (!cart) throw httpError(404, 'not_found', 'Carrito vacío');
  const result = repo.removeItem(cart.id, itemId);
  if (result.changes === 0) throw httpError(404, 'not_found', 'Ítem no encontrado en el carrito');
  return buildCartView(cart);
}

async function checkout(user, input, authHeaders) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', parsed.error.issues.map((i) => i.message).join(', '));
  }
  const cart = repo.getOpenCart(user.sub);
  if (!cart) throw httpError(400, 'empty_cart', 'No hay un carrito abierto');
  const items = repo.getItems(cart.id);
  if (items.length === 0) throw httpError(400, 'empty_cart', 'El carrito está vacío');

  const totalCents = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);

  // 1) Reserva de stock en el servicio de catálogo/inventario.
  await catalogClient.post('/internal/reserve-stock', {
    items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
  });

  // 2) Crea el pedido.
  const order = repo.createOrder({ userId: user.sub, cartId: cart.id, totalCents });

  // 3) Procesa el pago en el servicio de pagos.
  let payment;
  try {
    const { data } = await paymentClient.post(
      '/payments',
      {
        order_id: order.id,
        amount_cents: totalCents,
        method: parsed.data.payment_method,
        card_number: parsed.data.card_number,
      },
      { headers: authHeaders }
    );
    payment = data;
  } catch (err) {
    repo.updateOrderStatus(order.id, 'payment_failed');
    throw httpError(402, 'payment_failed', 'El pago fue rechazado');
  }

  // 4) Genera el envío en el servicio de envíos.
  const { data: shipment } = await shippingClient.post(
    '/shipments',
    { order_id: order.id, address: parsed.data.address },
    { headers: authHeaders }
  );

  // 5) Cierra el carrito y marca el pedido como confirmado.
  repo.updateOrderStatus(order.id, 'confirmed');
  repo.closeCart(cart.id);

  return {
    order: { ...order, status: 'confirmed' },
    payment,
    shipment,
    total_cents: totalCents,
  };
}

module.exports = { getCart, addItem, removeItem, checkout };
