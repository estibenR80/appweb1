package com.empresa.inventario.modelo;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Clase base que representa una transacción distribuida realizada por una
 * sucursal de la empresa de distribución de alimentos.
 *
 * Contiene la información general de la transacción: identificador, fecha y
 * hora, y el identificador de la sucursal que la realizó. Las subclases
 * {@link Compra} y {@link Venta} añaden el detalle específico de la operación.
 */
public class Transaccion implements Serializable {

    private static final long serialVersionUID = 1L;

    private int idTransaccion;
    private LocalDateTime fechaHora;
    private int idSucursal;

    public Transaccion() {
        this.fechaHora = LocalDateTime.now();
    }

    public Transaccion(int idTransaccion, int idSucursal) {
        this.idTransaccion = idTransaccion;
        this.idSucursal = idSucursal;
        this.fechaHora = LocalDateTime.now();
    }

    public int getIdTransaccion() {
        return idTransaccion;
    }

    public void setIdTransaccion(int idTransaccion) {
        this.idTransaccion = idTransaccion;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    /**
     * Tipo de transacción. Cada subclase devuelve su propio tipo.
     */
    public String getTipo() {
        return "TRANSACCION";
    }

    @Override
    public String toString() {
        return "Transaccion{idTransaccion=" + idTransaccion
                + ", fechaHora=" + fechaHora
                + ", idSucursal=" + idSucursal + "}";
    }
}
