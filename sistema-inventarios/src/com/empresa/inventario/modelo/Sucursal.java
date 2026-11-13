package com.empresa.inventario.modelo;

import java.io.Serializable;

/**
 * Representa una sucursal de la empresa de distribución de alimentos.
 * Corresponde a la tabla "Sucursales" de la base de datos MySQL.
 */
public class Sucursal implements Serializable {

    private static final long serialVersionUID = 1L;

    private int idSucursal;
    private String nombre;
    private String direccion;
    private String telefono;

    public Sucursal() {
    }

    public Sucursal(int idSucursal, String nombre, String direccion, String telefono) {
        this.idSucursal = idSucursal;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    @Override
    public String toString() {
        return "Sucursal{idSucursal=" + idSucursal
                + ", nombre='" + nombre + '\''
                + ", direccion='" + direccion + '\''
                + ", telefono='" + telefono + "'}";
    }
}
