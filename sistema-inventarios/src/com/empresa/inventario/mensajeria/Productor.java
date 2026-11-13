package com.empresa.inventario.mensajeria;

import com.empresa.inventario.modelo.Transaccion;
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.ObjectMessage;
import javax.jms.Session;

/**
 * Clase "Productor".
 *
 * Envía mensajes a una cola de ActiveMQ con la información de cada transacción
 * de compra o venta generada en una sucursal. Permite que la sede central y las
 * demás sucursales procesen las transacciones en tiempo real de forma asíncrona.
 */
public class Productor {

    /** URL del broker ActiveMQ (por defecto, instancia local). */
    public static final String URL_BROKER = ActiveMQConnectionFactory.DEFAULT_BROKER_URL;

    /** Nombre de la cola de transacciones. */
    public static final String NOMBRE_COLA = "COLA.TRANSACCIONES";

    private Connection conexion;
    private Session sesion;
    private MessageProducer productor;

    /**
     * Abre la conexión con el broker y crea el productor sobre la cola.
     */
    public void iniciar() throws Exception {
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(URL_BROKER);
        conexion = factory.createConnection();
        conexion.start();

        // Sesión transaccional desactivada; se confirma mensaje a mensaje.
        sesion = conexion.createSession(false, Session.AUTO_ACKNOWLEDGE);

        Destination cola = sesion.createQueue(NOMBRE_COLA);
        productor = sesion.createProducer(cola);
        productor.setDeliveryMode(DeliveryMode.PERSISTENT); // garantiza durabilidad
    }

    /**
     * Envía una transacción (Compra o Venta) a la cola de ActiveMQ.
     *
     * @param transaccion objeto Compra o Venta a publicar.
     */
    public void enviar(Transaccion transaccion) throws Exception {
        ObjectMessage mensaje = sesion.createObjectMessage(transaccion);
        mensaje.setStringProperty("tipo", transaccion.getTipo());
        productor.send(mensaje);
        System.out.println("[PRODUCTOR] Enviada -> " + transaccion);
    }

    /**
     * Cierra los recursos JMS.
     */
    public void cerrar() throws Exception {
        if (productor != null) productor.close();
        if (sesion != null) sesion.close();
        if (conexion != null) conexion.close();
    }
}
