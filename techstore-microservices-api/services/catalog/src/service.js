'use strict';

/**
 * Lógica de negocio del catálogo e inventario.
 * Valida entradas, gestiona el CRUD de productos y el control de stock.
 */
const { z } = require('zod');
const repo = require('./repository');
const { httpError } = require('../../../shared/appFactory');

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price_cents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  category: z.string().optional(),
});

function listProducts(query) {
  return repo.list({
    category: query.category,
    q: query.q,
    limit: Math.min(Number(query.limit) || 50, 100),
    offset: Number(query.offset) || 0,
  });
}

function getProduct(id) {
  const product = repo.findById(id);
  if (!product || !product.active) throw httpError(404, 'not_found', 'Producto no encontrado');
  return product;
}

function createProduct(input) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    throw httpError(400, 'validation_error', parsed.error.issues.map((i) => i.message).join(', '));
  }
  if (repo.findBySku(parsed.data.sku)) {
    throw httpError(409, 'conflict', 'El SKU ya existe');
  }
  return repo.create(parsed.data);
}

function updateProduct(id, input) {
  const existing = getProduct(id);
  const merged = {
    name: input.name ?? existing.name,
    description: input.description ?? existing.description,
    price_cents: input.price_cents ?? existing.price_cents,
    stock: input.stock ?? existing.stock,
    category: input.category ?? existing.category,
    active: input.active ?? existing.active,
  };
  return repo.update(id, merged);
}

function deleteProduct(id) {
  getProduct(id);
  repo.remove(id);
}

/** Reserva stock para el checkout; lanza error si no hay disponibilidad. */
function reserveStock(items) {
  for (const item of items) {
    const ok = repo.decrementStock(item.product_id, item.quantity);
    if (!ok) {
      throw httpError(409, 'out_of_stock', `Sin stock suficiente para el producto ${item.product_id}`);
    }
  }
  return true;
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  reserveStock,
};
