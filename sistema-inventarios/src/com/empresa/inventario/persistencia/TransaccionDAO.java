package com.empresa.inventario.persistencia;

import com.empresa.inventario.modelo.Compra;
import com.empresa.inventario.modelo.Venta;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

/**
 * DAO encargado de persistir las transacciones (compras y ventas) en la tabla
 * "Transacciones" de la base de datos MySQL. Es invocado por el Consumidor de
 * ActiveMQ al procesar cada mensaje recibido de la cola.
 */
public class TransaccionDAO {

    private static final String SQL_INSERT =
            "INSERT INTO Transacciones "
            + "(tipo, fecha_hora, id_sucursal, id_producto, cantidad, precio_unitario) "
            + "VALUES (?,?,?,?,?,?)";

    public void registrar(Compra compra) {
        guardar("COMPRA", compra.getIdSucursal(), compra.getIdProducto(),
                compra.getCantidad(), compra.getPrecioUnitario());
    }

    public void registrar(Venta venta) {
        guardar("VENTA", venta.getIdSucursal(), venta.getIdProducto(),
                venta.getCantidad(), venta.getPrecioUnitario());
    }

    private void guardar(String tipo, int idSucursal, int idProducto,
                         int cantidad, double precioUnitario) {
        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(SQL_INSERT)) {

            ps.setString(1, tipo);
            ps.setTimestamp(2, new Timestamp(System.currentTimeMillis()));
            ps.setInt(3, idSucursal);
            ps.setInt(4, idProducto);
            ps.setInt(5, cantidad);
            ps.setDouble(6, precioUnitario);
            ps.executeUpdate();

            System.out.println("[DAO] Transacción " + tipo + " registrada en MySQL.");
        } catch (Exception e) {
            System.err.println("[DAO] Error al registrar la transacción: " + e.getMessage());
        }
    }
}
