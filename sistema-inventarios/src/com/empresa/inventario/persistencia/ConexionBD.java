package com.empresa.inventario.persistencia;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Gestiona la conexión con la base de datos MySQL "gestion_inventarios".
 * Centraliza los parámetros de conexión (JDBC).
 */
public class ConexionBD {

    private static final String URL =
            "jdbc:mysql://localhost:3306/gestion_inventarios"
            + "?useSSL=false&serverTimezone=UTC";
    private static final String USUARIO = "root";
    private static final String CLAVE   = "root";

    public static Connection obtenerConexion() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver JDBC de MySQL no encontrado.", e);
        }
        return DriverManager.getConnection(URL, USUARIO, CLAVE);
    }
}
