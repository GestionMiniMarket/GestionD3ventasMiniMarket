USE railway;
-- Desactivar revisión de llaves foráneas temporalmente para evitar errores al recrear
SET FOREIGN_KEY_CHECKS=0;

-- --------------------------------------------------------
-- 1. ROLES
-- --------------------------------------------------------
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles VALUES 
(1,'Administrador'),
(2,'Cajero'),
(3,'Supervisor');

-- --------------------------------------------------------
-- 2. USUARIOS
-- --------------------------------------------------------
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT '1',
  creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY rol_id (rol_id),
  CONSTRAINT usuarios_ibfk_1 FOREIGN KEY (rol_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO usuarios VALUES 
(1,'Administrador','jj@gmail.com','$2b$10$pJY8laV5cc6Cx1XgdumoaeGGYLvuJ41UsPO3MweFEXBQ8X8T0pMFm',1,1,'2026-06-04 22:33:38'),
(2,'Dennys','dn@gmail.com','$2b$10$Z5.OYZRWgWMOaNayWWHiz.zAYiTK8f6jbsKoYJScNPn1zhv58LTDW',3,1,'2026-06-04 22:37:01'),
(3,'Fabian','fb@gmail.com','$2b$10$Cgb0ueatKylOxXOKb6kqWekgMr1E9gSBMEAKm16/T04fwR1bl59vW',2,1,'2026-06-04 22:37:24');

-- --------------------------------------------------------
-- 3. CATEGORIAS
-- --------------------------------------------------------
DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categorias VALUES 
(1,'Bebidas'),(2,'Snacks'),(3,'Lácteos'),
(4,'Abarrotes'),(5,'Limpieza'),(6,'Cuidado personal');

-- --------------------------------------------------------
-- 4. PRODUCTOS
-- --------------------------------------------------------
DROP TABLE IF EXISTS productos;
CREATE TABLE productos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT '0',
  stock_minimo INT NOT NULL DEFAULT '5',
  categoria_id INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT '1',
  creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY categoria_id (categoria_id),
  CONSTRAINT productos_ibfk_1 FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO productos VALUES 
(1,'Pepsi 355ml','bebida gasificada',1.00,6,5,1,1,'2026-06-04 22:59:42'),
(2,'Coca-Cola 600 ml','bebida gasificada',3.50,9,10,1,1,'2026-06-29 10:34:47');

-- --------------------------------------------------------
-- 5. CAJAS
-- --------------------------------------------------------
DROP TABLE IF EXISTS cajas;
CREATE TABLE cajas (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_cierre DATETIME DEFAULT NULL,
  monto_inicial DECIMAL(10,2) NOT NULL,
  monto_final DECIMAL(10,2) DEFAULT NULL,
  estado ENUM('abierta','esperando_cierre','cerrada') DEFAULT 'abierta',
  efectivo_contado DECIMAL(10,2) DEFAULT NULL,
  diferencia DECIMAL(10,2) DEFAULT NULL,
  observaciones TEXT,
  PRIMARY KEY (id),
  KEY usuario_id (usuario_id),
  CONSTRAINT cajas_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO cajas VALUES 
(1,1,'2026-06-29 05:01:40','2026-06-29 15:26:36',100.00,NULL,'cerrada',88.00,8.00,NULL),
(2,3,'2026-06-29 06:01:25','2026-06-29 07:34:15',50.00,NULL,'cerrada',61.00,0.00,NULL),
(3,3,'2026-06-29 06:18:55','2026-06-29 07:00:10',61.00,NULL,'cerrada',62.00,1.00,'sobra'),
(4,3,'2026-06-29 06:19:10','2026-06-29 07:34:15',2.00,NULL,'cerrada',1.00,-1.00,NULL),
(5,3,'2026-06-29 06:20:24','2026-06-29 07:01:18',10.00,NULL,'cerrada',10.00,-8.00,'falta demasiado '),
(6,3,'2026-06-29 06:20:58','2026-06-29 07:34:15',10.00,NULL,'cerrada',10.00,0.00,NULL),
(7,3,'2026-06-29 06:42:47','2026-06-29 07:32:58',10.00,NULL,'cerrada',20.00,0.00,'excelente'),
(8,3,'2026-06-29 06:43:17','2026-06-29 07:00:03',199.00,NULL,'cerrada',199.00,-1.00,'falta'),
(9,3,'2026-06-29 06:43:33','2026-06-29 06:59:46',2.00,NULL,'cerrada',6.00,0.50,NULL),
(10,3,'2026-06-29 06:44:03','2026-06-29 06:59:45',10.00,NULL,'cerrada',2.00,1.00,NULL),
(11,3,'2026-06-29 07:45:42','2026-06-29 15:16:53',10.00,NULL,'cerrada',10.00,0.00,NULL),
(12,3,'2026-06-29 07:49:39',NULL,8.00,NULL,'esperando_cierre',8.00,0.00,NULL),
(13,3,'2026-06-29 07:55:50',NULL,20.00,NULL,'esperando_cierre',10.00,-10.00,NULL),
(14,3,'2026-06-29 15:15:56','2026-06-29 15:25:13',10.00,NULL,'cerrada',10.00,2.00,NULL);

-- --------------------------------------------------------
-- 6. EGRESOS_CAJA
-- --------------------------------------------------------
DROP TABLE IF EXISTS egresos_caja;
CREATE TABLE egresos_caja (
  id INT NOT NULL AUTO_INCREMENT,
  caja_id INT NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY caja_id (caja_id),
  CONSTRAINT egresos_caja_ibfk_1 FOREIGN KEY (caja_id) REFERENCES cajas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO egresos_caja VALUES 
(1,1,'COMPRA',20.00,'2026-06-29 10:20:33'),
(2,10,'compra',9.00,'2026-06-29 11:44:09'),
(3,14,'compra',2.00,'2026-06-29 20:16:12');

-- --------------------------------------------------------
-- 7. VENTAS
-- --------------------------------------------------------
DROP TABLE IF EXISTS ventas;
CREATE TABLE ventas (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  caja_id INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('efectivo','tarjeta') NOT NULL DEFAULT 'efectivo',
  PRIMARY KEY (id),
  KEY usuario_id (usuario_id),
  KEY caja_id (caja_id),
  CONSTRAINT ventas_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT ventas_ibfk_2 FOREIGN KEY (caja_id) REFERENCES cajas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO ventas VALUES 
(1,3,2,'2026-06-29 06:01:43',10.00,'efectivo'),
(2,3,2,'2026-06-29 06:01:58',5.50,'tarjeta'),
(3,3,2,'2026-06-29 06:02:42',1.00,'tarjeta'),
(4,3,2,'2026-06-29 06:02:51',3.50,'tarjeta'),
(5,3,2,'2026-06-29 06:03:04',1.00,'efectivo'),
(6,3,5,'2026-06-29 06:20:31',8.00,'efectivo'),
(7,3,6,'2026-06-29 06:21:05',3.50,'tarjeta'),
(8,3,7,'2026-06-29 06:42:53',10.00,'efectivo'),
(9,3,8,'2026-06-29 06:43:21',1.00,'efectivo'),
(10,3,9,'2026-06-29 06:43:39',3.50,'efectivo'),
(11,1,1,'2026-06-29 15:25:35',5.50,'tarjeta');

-- --------------------------------------------------------
-- 8. DETALLE_VENTAS
-- --------------------------------------------------------
DROP TABLE IF EXISTS detalle_ventas;
CREATE TABLE detalle_ventas (
  id INT NOT NULL AUTO_INCREMENT,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY venta_id (venta_id),
  KEY producto_id (producto_id),
  CONSTRAINT detalle_ventas_ibfk_1 FOREIGN KEY (venta_id) REFERENCES ventas (id),
  CONSTRAINT detalle_ventas_ibfk_2 FOREIGN KEY (producto_id) REFERENCES productos (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO detalle_ventas VALUES 
(1,1,2,2,3.50,7.00),(2,1,1,3,1.00,3.00),(3,2,2,1,3.50,3.50),
(4,2,1,2,1.00,2.00),(5,3,1,1,1.00,1.00),(6,4,2,1,3.50,3.50),
(7,5,1,1,1.00,1.00),(8,6,2,2,3.50,7.00),(9,6,1,1,1.00,1.00),
(10,7,2,1,3.50,3.50),(11,8,2,2,3.50,7.00),(12,8,1,3,1.00,3.00),
(13,9,1,1,1.00,1.00),(14,10,2,1,3.50,3.50),(15,11,2,1,3.50,3.50),
(16,11,1,2,1.00,2.00);

-- Volver a activar la revisión de llaves foráneas
SET FOREIGN_KEY_CHECKS=1;