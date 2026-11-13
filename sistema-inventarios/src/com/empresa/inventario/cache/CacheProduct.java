package com.empresa.inventario.cache;

import com.empresa.inventario.modelo.Producto;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Clase "CacheProduct".
 *
 * Almacena en caché la información de los productos para mejorar el rendimiento
 * del sistema de gestión de inventarios, evitando consultas repetidas a la base
 * de datos MySQL. Implementada como singleton con un mapa concurrente para
 * soportar múltiples hilos (acceso distribuido entre sucursales).
 */
public class CacheProduct {

    private static final CacheProduct INSTANCIA = new CacheProduct();

    /** Mapa clave=idProducto, valor=Producto. */
    private final Map<Integer, Producto> cache = new ConcurrentHashMap<>();

    private CacheProduct() {
    }

    public static CacheProduct getInstancia() {
        return INSTANCIA;
    }

    /** Agrega o actualiza un producto en la caché. */
    public void put(Producto producto) {
        cache.put(producto.getIdProducto(), producto);
    }

    /** Devuelve un producto desde la caché (o null si no está). */
    public Producto get(int idProducto) {
        return cache.get(idProducto);
    }

    /** Indica si el producto ya se encuentra en caché. */
    public boolean contiene(int idProducto) {
        return cache.containsKey(idProducto);
    }

    /** Invalida (elimina) un producto de la caché. */
    public void invalidar(int idProducto) {
        cache.remove(idProducto);
    }

    /** Limpia toda la caché de productos. */
    public void limpiar() {
        cache.clear();
    }

    public int tamano() {
        return cache.size();
    }
}
