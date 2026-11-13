package com.empresa.inventario.mensajeria;

import com.empresa.inventario.modelo.Compra;
import com.empresa.inventario.modelo.Transaccion;
import com.empresa.inventario.modelo.Venta;
import com.empresa.inventario.persistencia.TransaccionDAO;
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.jms.Session;

/**
 * Clase "Consumidor".
 *
 * Lee los mensajes de la cola de ActiveMQ y los procesa persistiéndolos en la
 * base de datos del sistema de gestión de inventarios. Trabaja de forma
 * asíncrona mediante un {@link MessageListener}.
 */
public class Consumidor implements MessageListener {

    private Connection conexion;
    private Session sesion;
    private MessageConsumer consumidor;

    private final TransaccionDAO dao = new TransaccionDAO();

    /**
     * Abre la conexión y comienza a escuchar la cola de transacciones.
     */
    public void iniciar() throws Exception {
        ActiveMQConnectionFactory factory =
                new ActiveMQConnectionFactory(Productor.URL_BROKER);
        conexion = factory.createConnection();
        conexion.start();

        sesion = conexion.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Destination cola = sesion.createQueue(Productor.NOMBRE_COLA);
        consumidor = sesion.createConsumer(cola);
        consumidor.setMessageListener(this);

        System.out.println("[CONSUMIDOR] Escuchando la cola " + Productor.NOMBRE_COLA + " ...");
    }

    /**
     * Procesa cada mensaje recibido de la cola.
     */
    @Override
    public void onMessage(Message message) {
        try {
            if (message instanceof ObjectMessage) {
                Object contenido = ((ObjectMessage) message).getObject();

                if (contenido instanceof Compra) {
                    Compra compra = (Compra) contenido;
                    System.out.println("[CONSUMIDOR] Procesando COMPRA -> " + compra);
                    dao.registrar(compra);
                } else if (contenido instanceof Venta) {
                    Venta venta = (Venta) contenido;
                    System.out.println("[CONSUMIDOR] Procesando VENTA -> " + venta);
                    dao.registrar(venta);
                } else if (contenido instanceof Transaccion) {
                    System.out.println("[CONSUMIDOR] Transacción genérica: " + contenido);
                }
            }
        } catch (Exception e) {
            System.err.println("[CONSUMIDOR] Error al procesar el mensaje: " + e.getMessage());
        }
    }

    public void cerrar() throws Exception {
        if (consumidor != null) consumidor.close();
        if (sesion != null) sesion.close();
        if (conexion != null) conexion.close();
    }
}
