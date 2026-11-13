package com.empresa.inventario.cache;

import com.empresa.inventario.modelo.Sucursal;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Clase "CacheBranch".
 *
 * Almacena en caché la información de las sucursales para mejorar el
 * rendimiento del sistema de gestión de inventarios, reduciendo las consultas
 * a la base de datos MySQL. Implementada como singleton con un mapa concurrente
 * para dar soporte a accesos simultáneos en el entorno distribuido.
 */
public class CacheBranch {

    private static final CacheBranch INSTANCIA = new CacheBranch();

    /** Mapa clave=idSucursal, valor=Sucursal. */
    private final Map<Integer, Sucursal> cache = new ConcurrentHashMap<>();

    private CacheBranch() {
    }

    public static CacheBranch getInstancia() {
        return INSTANCIA;
    }

    /** Agrega o actualiza una sucursal en la caché. */
    public void put(Sucursal sucursal) {
        cache.put(sucursal.getIdSucursal(), sucursal);
    }

    /** Devuelve una sucursal desde la caché (o null si no está). */
    public Sucursal get(int idSucursal) {
        return cache.get(idSucursal);
    }

    /** Indica si la sucursal ya se encuentra en caché. */
    public boolean contiene(int idSucursal) {
        return cache.containsKey(idSucursal);
    }

    /** Invalida (elimina) una sucursal de la caché. */
    public void invalidar(int idSucursal) {
        cache.remove(idSucursal);
    }

    /** Limpia toda la caché de sucursales. */
    public void limpiar() {
        cache.clear();
    }

    public int tamano() {
        return cache.size();
    }
}
