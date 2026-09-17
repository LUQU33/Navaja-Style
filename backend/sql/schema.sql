-- Esquema NavajaStyle para MySQL
-- Traducido desde el esquema real de PostgreSQL 16 (verificado con pg_dump --schema-only).
-- Orden de creación respeta las dependencias de FK.

CREATE DATABASE IF NOT EXISTS NavajaStyle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE NavajaStyle;

-- ============
-- Catálogo
-- ============

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE colores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    hex CHAR(7),
    UNIQUE KEY uq_colores_nombre (nombre),
    CONSTRAINT check_hex CHECK (hex REGEXP '^#[0-9A-Fa-f]{6}$')
) ENGINE=InnoDB;

CREATE TABLE talles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    orden INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_talles_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    categoria_id INT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_precio CHECK (precio >= 0),
    CONSTRAINT check_productos_estado CHECK (estado IN ('activo', 'inactivo', 'borrador')),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE variantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    color_id INT NOT NULL,
    talle_id INT NOT NULL,
    sku VARCHAR(50),
    stock INT NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_variantes_producto_color_talle (producto_id, color_id, talle_id),
    UNIQUE KEY uq_variantes_sku (sku),
    CONSTRAINT check_stock CHECK (stock >= 0),
    CONSTRAINT fk_variante_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT fk_variante_color FOREIGN KEY (color_id) REFERENCES colores(id) ON DELETE RESTRICT,
    CONSTRAINT fk_variante_talle FOREIGN KEY (talle_id) REFERENCES talles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============
-- Usuarios
-- ============

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(30),
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuarios_email (email),
    CONSTRAINT check_rol CHECK (rol IN ('cliente', 'admin'))
) ENGINE=InnoDB;

CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    piso_depto VARCHAR(30),
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20) NOT NULL,
    referencia TEXT,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_direccion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============
-- Carrito
-- ============

CREATE TABLE carritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    session_token VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrito_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT check_carrito_owner CHECK (usuario_id IS NOT NULL OR session_token IS NOT NULL)
) ENGINE=InnoDB;

CREATE TABLE carrito_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT NOT NULL,
    variante_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_carrito_items_carrito_variante (carrito_id, variante_id),
    CONSTRAINT fk_item_carrito FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_variante FOREIGN KEY (variante_id) REFERENCES variantes(id) ON DELETE CASCADE,
    CONSTRAINT check_carrito_items_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB;

-- ============
-- Pagos (metodos_pago va antes de ordenes/pagos por dependencia de FK)
-- ============

CREATE TABLE metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL,
    nombre_visible VARCHAR(50) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_metodos_pago_codigo (codigo)
) ENGINE=InnoDB;

-- ============
-- Órdenes
-- ============

CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    direccion_id INT,
    envio_calle VARCHAR(150) NOT NULL,
    envio_numero VARCHAR(20) NOT NULL,
    envio_piso_depto VARCHAR(30),
    envio_ciudad VARCHAR(100) NOT NULL,
    envio_provincia VARCHAR(100) NOT NULL,
    envio_codigo_postal VARCHAR(20) NOT NULL,
    envio_referencia TEXT,
    total NUMERIC(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_total CHECK (total >= 0),
    CONSTRAINT check_ordenes_estado CHECK (estado IN ('pendiente', 'pagada', 'enviada', 'entregada', 'cancelada')),
    CONSTRAINT fk_orden_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_orden_direccion FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE orden_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    variante_id INT,
    descripcion VARCHAR(255) NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    CONSTRAINT check_precio_unitario CHECK (precio_unitario >= 0),
    CONSTRAINT check_orden_items_cantidad CHECK (cantidad > 0),
    CONSTRAINT check_subtotal CHECK (subtotal >= 0),
    CONSTRAINT fk_o_item_orden FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    CONSTRAINT fk_o_item_variante FOREIGN KEY (variante_id) REFERENCES variantes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    metodo_id INT NOT NULL,
    monto NUMERIC(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    transaccion_id VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_monto CHECK (monto >= 0),
    CONSTRAINT check_pagos_estado CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'reembolsado')),
    CONSTRAINT fk_pago_orden FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pago_metodo FOREIGN KEY (metodo_id) REFERENCES metodos_pago(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
