'use strict';

/** Tests de la LÓGICA DE NEGOCIO del catálogo e inventario. */
const { getDb, resetDb } = require('../shared/db');
const catalog = require('../services/catalog/src/service');

beforeEach(() => {
  resetDb();
  getDb();
});

function sampleProduct(overrides = {}) {
  return {
    sku: 'SKU-TEST',
    name: 'Producto Test',
    description: 'Desc',
    price_cents: 10000,
    stock: 5,
    category: 'test',
    ...overrides,
  };
}

describe('Catalog service - lógica de negocio', () => {
  test('crea y lista productos', () => {
    catalog.createProduct(sampleProduct());
    const list = catalog.listProducts({});
    expect(list).toHaveLength(1);
    expect(list[0].sku).toBe('SKU-TEST');
  });

  test('impide SKU duplicado', () => {
    catalog.createProduct(sampleProduct());
    expect(() => catalog.createProduct(sampleProduct())).toThrow(/SKU ya existe/);
  });

  test('actualiza un producto existente', () => {
    const p = catalog.createProduct(sampleProduct());
    const updated = catalog.updateProduct(p.id, { price_cents: 20000 });
    expect(updated.price_cents).toBe(20000);
    expect(updated.name).toBe('Producto Test'); // conserva los demás campos
  });

  test('getProduct lanza 404 si no existe', () => {
    expect(() => catalog.getProduct(999)).toThrow(/no encontrado/);
  });

  test('reserveStock descuenta inventario correctamente', () => {
    const p = catalog.createProduct(sampleProduct({ stock: 3 }));
    catalog.reserveStock([{ product_id: p.id, quantity: 2 }]);
    expect(catalog.getProduct(p.id).stock).toBe(1);
  });

  test('reserveStock falla cuando no hay stock suficiente', () => {
    const p = catalog.createProduct(sampleProduct({ stock: 1 }));
    expect(() => catalog.reserveStock([{ product_id: p.id, quantity: 5 }])).toThrow(
      /stock suficiente/
    );
  });

  test('deleteProduct hace borrado lógico (desactiva)', () => {
    const p = catalog.createProduct(sampleProduct());
    catalog.deleteProduct(p.id);
    expect(catalog.listProducts({})).toHaveLength(0);
  });
});
