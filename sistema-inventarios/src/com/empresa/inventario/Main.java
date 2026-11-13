package com.empresa.inventario;

import com.empresa.inventario.cache.CacheBranch;
import com.empresa.inventario.cache.CacheProduct;
import com.empresa.inventario.mensajeria.Consumidor;
import com.empresa.inventario.mensajeria.Productor;
import com.empresa.inventario.modelo.Compra;
import com.empresa.inventario.modelo.Producto;
import com.empresa.inventario.modelo.Sucursal;
import com.empresa.inventario.modelo.Venta;

/**
 * Clase principal de demostración del Sistema de Gestión de Inventarios de la
 * empresa de distribución de alimentos.
 *
 * Flujo:
 *   1. Carga la caché de productos y sucursales (CacheProduct / CacheBranch).
 *   2. Levanta el Consumidor que escucha la cola de ActiveMQ.
 *   3. El Productor publica transacciones de Compra y Venta en la cola.
 *   4. El Consumidor procesa cada mensaje y lo persiste en MySQL vía DAO.
 *
 * Requisitos: broker ActiveMQ en ejecución (tcp://localhost:61616) y la base
 * de datos "gestion_inventarios" creada en MySQL.
 */
public class Main {

    public static void main(String[] args) throws Exception {

        // ---- 1. Precarga de caché distribuido --------------------------------
        CacheProduct cacheProductos = CacheProduct.getInstancia();
        CacheBranch cacheSucursales = CacheBranch.getInstancia();

        cacheProductos.put(new Producto(1, "Arroz Premium 5kg", "Arroz blanco premium", 28500.00));
        cacheProductos.put(new Producto(2, "Aceite Vegetal 3L", "Aceite vegetal", 21900.00));

        cacheSucursales.put(new Sucursal(1, "Sucursal Bogotá Norte", "Cra 15 # 100-20", "601-7001001"));
        cacheSucursales.put(new Sucursal(2, "Sucursal Medellín Centro", "Cl 50 # 45-30", "604-7002002"));

        System.out.println("Caché cargada: "
                + cacheProductos.tamano() + " productos, "
                + cacheSucursales.tamano() + " sucursales.");
        System.out.println("Lectura desde caché -> " + cacheProductos.get(1));

        // ---- 2. Consumidor (escucha la cola) ---------------------------------
        Consumidor consumidor = new Consumidor();
        consumidor.iniciar();

        // ---- 3. Productor (publica transacciones) ----------------------------
        Productor productor = new Productor();
        productor.iniciar();

        // Transacción de VENTA (sucursal 1 vende producto 1)
        productor.enviar(new Venta(0, 1, 1, 10, 28500.00));

        // Transacción de COMPRA (sucursal 2 compra producto 2 a la sede central)
        productor.enviar(new Compra(0, 2, 2, 50, 21900.00));

        // Espera breve para que el consumidor procese los mensajes.
        Thread.sleep(2000);

        // ---- 4. Cierre de recursos ------------------------------------------
        productor.cerrar();
        consumidor.cerrar();

        System.out.println("Demostración finalizada.");
    }
}
