# Sistema de Gestión de Inventarios — Empresa de Distribución de Alimentos

Proyecto de ejemplo para el caso **"Empresa de distribución de alimentos"** del curso
**Sistemas Transaccionales**. Implementa transacciones distribuidas en tiempo real
entre sucursales y la sede central usando **MySQL**, **Java (NetBeans)** y **ActiveMQ**.

## Estructura del proyecto

```
sistema-inventarios/
├── database/
│   └── 01_crear_base_datos.sql        # Script MySQL: BD + tablas Sucursales y Productos
├── src/com/empresa/inventario/
│   ├── Main.java                      # Demostración del flujo completo
│   ├── modelo/
│   │   ├── Transaccion.java           # Clase base de transacción
│   │   ├── Compra.java                # Transacción de compra
│   │   ├── Venta.java                 # Transacción de venta
│   │   ├── Producto.java              # Entidad Producto
│   │   └── Sucursal.java              # Entidad Sucursal
│   ├── mensajeria/
│   │   ├── Productor.java             # Publica transacciones en cola ActiveMQ
│   │   └── Consumidor.java            # Lee la cola y persiste en MySQL
│   ├── cache/
│   │   ├── CacheProduct.java          # Caché distribuido de productos
│   │   └── CacheBranch.java           # Caché distribuido de sucursales
│   └── persistencia/
│       ├── ConexionBD.java            # Conexión JDBC a MySQL
│       └── TransaccionDAO.java        # Persiste compras y ventas
└── README.md
```

## Requisitos

- **JDK 8+** (el proyecto se desarrolla en NetBeans).
- **MySQL 8.x** con la base de datos creada a partir del script `database/01_crear_base_datos.sql`.
- **Apache ActiveMQ 5.x** en ejecución (`bin/activemq start`), broker por defecto en `tcp://localhost:61616`.
- Dependencias (JAR) en el classpath del proyecto NetBeans:
  - `activemq-all-5.x.x.jar`
  - `mysql-connector-j-8.x.x.jar`

## Pasos de ejecución

1. **Crear la base de datos** en MySQL:
   ```bash
   mysql -u root -p < database/01_crear_base_datos.sql
   ```
2. **Iniciar ActiveMQ**:
   ```bash
   cd apache-activemq-5.x.x/bin
   ./activemq start
   ```
   Consola de administración: `http://localhost:8161/admin` (admin/admin).
3. **Abrir el proyecto en NetBeans**, agregar los JAR al classpath y ejecutar `Main.java`.

## Flujo funcional

1. Se precargan productos y sucursales en el **caché distribuido** (`CacheProduct` / `CacheBranch`).
2. El **Consumidor** se suscribe a la cola `COLA.TRANSACCIONES`.
3. El **Productor** publica transacciones de **Compra** y **Venta** en la cola de ActiveMQ.
4. El **Consumidor** lee cada mensaje y lo persiste en la tabla `Transacciones` de MySQL.

Este desacople mediante mensajería garantiza procesamiento **asíncrono, en tiempo real
y tolerante a fallos** entre las múltiples sucursales y la sede central.
