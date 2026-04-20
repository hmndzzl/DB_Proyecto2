-- ==============================================================================
-- PROYECTO 2 - Bases de Datos 1
-- Hugo Méndez Lee - 241265
-- ==============================================================================

-- ==============================================================================
-- CREACIÓN DE ESQUEMA (DDL)
-- ==============================================================================

DROP TABLE IF EXISTS detalle_venta CASCADE;
DROP TABLE IF EXISTS venta CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS telefonos_empleados CASCADE;
DROP TABLE IF EXISTS telefonos_clientes CASCADE;
DROP TABLE IF EXISTS telefonos_proveedores CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS proveedor CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;

-- Catálogos
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) UNIQUE NOT NULL,
    descripcion_categoria TEXT
);

CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    correo_cliente VARCHAR(100) UNIQUE,
    nit_cliente VARCHAR(20) UNIQUE
);

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre_empleado VARCHAR(100) NOT NULL,
    correo_empleado VARCHAR(100) UNIQUE NOT NULL,
    fecha_contratacion DATE NOT NULL,
    id_encargado INT,
    FOREIGN KEY (id_encargado) REFERENCES empleado(id_empleado)
);

-- Tablas Dependientes
CREATE TABLE telefonos_proveedores (
    id_telefono_proveedor SERIAL PRIMARY KEY,
    telefono_proveedor VARCHAR(15) NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor) ON DELETE CASCADE
);

CREATE TABLE telefonos_clientes (
    id_telefono_cliente SERIAL PRIMARY KEY,
    telefono_cliente VARCHAR(15) NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE telefonos_empleados (
    id_telefono_empleado SERIAL PRIMARY KEY,
    telefono_empleado VARCHAR(15) NOT NULL,
    id_empleado INT NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE CASCADE
);

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(150) NOT NULL,
    precio_producto DECIMAL(10,2) NOT NULL CHECK (precio_producto > 0),
    stock_producto INT NOT NULL CHECK (stock_producto >= 0),
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

-- Transaccionales 
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha_venta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    total_venta DECIMAL(12,2) NOT NULL CHECK (total_venta >= 0),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);