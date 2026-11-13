-- ============================================================================
--  Caso: Empresa de distribución de alimentos
--  Script de creación de la base de datos del Sistema de Gestión de Inventarios
--  Motor: MySQL 8.x
--  Autor: [Nombre completo del estudiante]
-- ============================================================================

-- 1. Creación de la base de datos
DROP DATABASE IF EXISTS gestion_inventarios;
CREATE DATABASE gestion_inventarios
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestion_inventarios;

-- ----------------------------------------------------------------------------
-- 2. Tabla "Sucursales"
--    Contiene la información de cada sucursal de la empresa a nivel nacional.
-- ----------------------------------------------------------------------------
CREATE TABLE Sucursales (
    id_sucursal   INT          NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(120) NOT NULL,
    direccion     VARCHAR(200) NOT NULL,
    telefono      VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id_sucursal)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. Tabla "Productos"
--    Contiene la información de cada producto distribuido por la empresa.
-- ----------------------------------------------------------------------------
CREATE TABLE Productos (
    id_producto   INT           NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(120)  NOT NULL,
    descripcion   VARCHAR(255)  NOT NULL,
    precio        DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id_producto)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. Tabla "Transacciones" (general)
--    Registra cada transacción (compra o venta) realizada por una sucursal.
--    Se usa para persistir los mensajes procesados por el Consumidor de ActiveMQ.
-- ----------------------------------------------------------------------------
CREATE TABLE Transacciones (
    id_transaccion INT           NOT NULL AUTO_INCREMENT,
    tipo           ENUM('COMPRA','VENTA') NOT NULL,
    fecha_hora     DATETIME      NOT NULL,
    id_sucursal    INT           NOT NULL,
    id_producto    INT           NOT NULL,
    cantidad       INT           NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id_transaccion),
    CONSTRAINT fk_trans_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal),
    CONSTRAINT fk_trans_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. Datos de ejemplo
-- ----------------------------------------------------------------------------
INSERT INTO Sucursales (nombre, direccion, telefono) VALUES
('Sucursal Bogotá Norte',   'Cra 15 # 100-20, Bogotá',     '601-7001001'),
('Sucursal Medellín Centro','Cl 50 # 45-30, Medellín',     '604-7002002'),
('Sucursal Cali Sur',       'Av 6N # 23-10, Cali',         '602-7003003'),
('Sede Central',            'Zona Franca Km 5, Bogotá',    '601-7000000');

INSERT INTO Productos (nombre, descripcion, precio) VALUES
('Arroz Premium 5kg',  'Bulto de arroz blanco grado premium',       28500.00),
('Aceite Vegetal 3L',  'Aceite 100% vegetal para cocina',           21900.00),
('Azúcar Blanca 2kg',  'Azúcar refinada empacada',                   8900.00),
('Harina de Trigo 1kg','Harina fortificada para panadería',          4500.00),
('Leche UHT 1L',       'Leche entera larga vida caja x12',          45000.00);

-- ----------------------------------------------------------------------------
-- 6. Consultas de verificación
-- ----------------------------------------------------------------------------
SELECT * FROM Sucursales;
SELECT * FROM Productos;
SELECT * FROM Transacciones;
