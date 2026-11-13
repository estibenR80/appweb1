package com.empresa.inventario.modelo;

import java.io.Serializable;

/**
 * Representa un producto distribuido por la empresa de alimentos.
 * Corresponde a la tabla "Productos" de la base de datos MySQL.
 */
public class Producto implements Serializable {

    private static final long serialVersionUID = 1L;

    private int idProducto;
    private String nombre;
    private String descripcion;
    private double precio;

    public Producto() {
    }

    public Producto(int idProducto, String nombre, String descripcion, double precio) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    @Override
    public String toString() {
        return "Producto{idProducto=" + idProducto
                + ", nombre='" + nombre + '\''
                + ", precio=" + precio + "}";
    }
}
