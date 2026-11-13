package com.empresa.inventario.modelo;

/**
 * Representa una transacción de COMPRA realizada por una sucursal o por la
 * sede central (reabastecimiento de inventario). Hereda los datos generales
 * de {@link Transaccion} y añade el detalle del producto adquirido.
 */
public class Compra extends Transaccion {

    private static final long serialVersionUID = 1L;

    private int idProducto;
    private int cantidad;
    private double precioUnitario;

    public Compra() {
        super();
    }

    public Compra(int idTransaccion, int idSucursal,
                  int idProducto, int cantidad, double precioUnitario) {
        super(idTransaccion, idSucursal);
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public double getTotal() {
        return cantidad * precioUnitario;
    }

    @Override
    public String getTipo() {
        return "COMPRA";
    }

    @Override
    public String toString() {
        return "Compra{idTransaccion=" + getIdTransaccion()
                + ", idSucursal=" + getIdSucursal()
                + ", idProducto=" + idProducto
                + ", cantidad=" + cantidad
                + ", precioUnitario=" + precioUnitario
                + ", total=" + getTotal() + "}";
    }
}
