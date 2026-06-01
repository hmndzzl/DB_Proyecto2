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
DROP TABLE IF EXISTS rol CASCADE;
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

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre_empleado VARCHAR(100) NOT NULL,
    correo_empleado VARCHAR(100) UNIQUE NOT NULL, 
    password_empleado VARCHAR(255) NOT NULL,
    fecha_contratacion DATE NOT NULL,
    id_rol INT NOT NULL,                         
    id_encargado INT,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
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

-- ==============================================================================
-- VISTAS
-- ==========================================
CREATE OR REPLACE VIEW vista_ventas_detalladas AS
SELECT 
    v.id_venta,
    v.fecha_venta,
    c.nombre_cliente,
    e.nombre_empleado,
    p.nombre_producto,
    cat.nombre_categoria,
    dv.cantidad,
    dv.precio_unitario,
    dv.subtotal
FROM venta v
JOIN cliente c ON v.id_cliente = c.id_cliente
JOIN empleado e ON v.id_empleado = e.id_empleado
JOIN detalle_venta dv ON v.id_venta = dv.id_venta
JOIN producto p ON dv.id_producto = p.id_producto
JOIN categoria cat ON p.id_categoria = cat.id_categoria;

-- ==============================================================================
-- ÍNDICES (Para optimización de consultas)
-- ==========================================
CREATE INDEX idx_cliente_nit ON cliente(nit_cliente);
CREATE INDEX idx_venta_fecha ON venta(fecha_venta);

-- ==============================================================================
-- SEGURIDAD Y ROLES EN EL DBMS
-- ==============================================================================

-- 1. Eliminar roles si ya existen para evitar conflictos en reinicios
DROP ROLE IF EXISTS rol_admin;
DROP ROLE IF EXISTS rol_vendedor;
DROP ROLE IF EXISTS rol_supervisor;
DROP ROLE IF EXISTS rol_inventario;
DROP ROLE IF EXISTS rol_auditor;

-- 2. Crear los 5 roles
CREATE ROLE rol_admin;
CREATE ROLE rol_vendedor;
CREATE ROLE rol_supervisor;
CREATE ROLE rol_inventario;
CREATE ROLE rol_auditor;

-- 3. Otorgar permisos al rol_admin (Acceso completo)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rol_admin;

-- 4. Otorgar permisos al rol_vendedor (Ventas y clientes, solo lectura de catálogo)
GRANT SELECT ON producto, categoria TO rol_vendedor;
GRANT SELECT, INSERT, UPDATE, DELETE ON cliente, telefonos_clientes TO rol_vendedor;
GRANT SELECT, INSERT ON venta, detalle_venta TO rol_vendedor;
GRANT USAGE, SELECT ON SEQUENCE cliente_id_cliente_seq, telefonos_clientes_id_telefono_cliente_seq, venta_id_venta_seq, detalle_venta_id_detalle_seq TO rol_vendedor;

-- 5. Otorgar permisos al rol_supervisor (Gestión de catálogos y reportes)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_supervisor;
GRANT SELECT, INSERT, UPDATE, DELETE ON producto, categoria, cliente, telefonos_clientes TO rol_supervisor;
GRANT USAGE, SELECT ON SEQUENCE producto_id_producto_seq, categoria_id_categoria_seq, cliente_id_cliente_seq, telefonos_clientes_id_telefono_cliente_seq TO rol_supervisor;

-- 6. Otorgar permisos al rol_inventario (Solo gestión de inventarios y proveedores)
GRANT SELECT, INSERT, UPDATE, DELETE ON producto, categoria, proveedor, telefonos_proveedores TO rol_inventario;
GRANT USAGE, SELECT ON SEQUENCE producto_id_producto_seq, categoria_id_categoria_seq, proveedor_id_proveedor_seq, telefonos_proveedores_id_telefono_proveedor_seq TO rol_inventario;

-- 7. Otorgar permisos al rol_auditor (Solo lectura de todas las tablas y vistas)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_auditor;

-- 8. Otorgar permisos para que el usuario proy3 pueda asumir estos roles
GRANT rol_admin TO proy3;
GRANT rol_vendedor TO proy3;
GRANT rol_supervisor TO proy3;
GRANT rol_inventario TO proy3;
GRANT rol_auditor TO proy3;


-- ==============================================================================
-- STORED PROCEDURES (PostgreSQL PROCEDURES)
-- ==============================================================================

-- 1. sp_registrar_venta: Registra una venta completa con control transaccional explícito y manejo de excepciones
CREATE OR REPLACE PROCEDURE sp_registrar_venta(
    p_id_cliente INT,
    p_id_empleado INT,
    p_productos INT[],
    p_cantidades INT[],
    INOUT p_id_venta INT,
    INOUT p_error_message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    i INT;
    v_total DECIMAL(12,2) := 0;
    v_precio DECIMAL(10,2);
    v_stock INT;
    v_subtotal DECIMAL(12,2);
BEGIN
    p_error_message := '';
    
    -- Validar longitud de arreglos
    IF array_length(p_productos, 1) IS NULL OR array_length(p_productos, 1) != array_length(p_cantidades, 1) THEN
        p_error_message := 'Los arreglos de productos y cantidades no coinciden o están vacíos.';
        p_id_venta := NULL;
        ROLLBACK;
        RETURN;
    END IF;

    -- Registrar la venta principal (cabecera con total provisional = 0)
    INSERT INTO venta (id_cliente, id_empleado, fecha_venta, total_venta)
    VALUES (p_id_cliente, p_id_empleado, NOW(), 0)
    RETURNING id_venta INTO p_id_venta;

    -- Iterar sobre el carrito
    FOR i IN 1..array_length(p_productos, 1) LOOP
        -- Obtener precio y stock del producto actual
        SELECT precio_producto, stock_producto INTO v_precio, v_stock
        FROM producto
        WHERE id_producto = p_productos[i];

        -- Validar si el producto existe
        IF v_precio IS NULL THEN
            p_error_message := 'El producto con ID ' || p_productos[i] || ' no existe.';
            p_id_venta := NULL;
            ROLLBACK;
            RETURN;
        END IF;

        -- Validar existencias en stock
        IF v_stock < p_cantidades[i] THEN
            p_error_message := 'Stock insuficiente para el producto ID ' || p_productos[i] || '. Disponible: ' || v_stock || ', Solicitado: ' || p_cantidades[i];
            p_id_venta := NULL;
            ROLLBACK;
            RETURN;
        END IF;

        -- Calcular subtotal
        v_subtotal := v_precio * p_cantidades[i];
        v_total := v_total + v_subtotal;

        -- Insertar el detalle de la venta
        INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (p_id_venta, p_productos[i], p_cantidades[i], v_precio, v_subtotal);

        -- Restar stock del producto
        UPDATE producto
        SET stock_producto = stock_producto - p_cantidades[i]
        WHERE id_producto = p_productos[i];
    END LOOP;

    -- Actualizar el total de la venta con la sumatoria real
    UPDATE venta
    SET total_venta = v_total
    WHERE id_venta = p_id_venta;

    -- Confirmar la transacción
    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        p_error_message := 'Error inesperado al registrar la venta: ' || SQLERRM;
        p_id_venta := NULL;
        ROLLBACK;
END;
$$;


-- 2. sp_crear_producto: Registra un nuevo producto y retorna su ID
CREATE OR REPLACE PROCEDURE sp_crear_producto(
    p_nombre_producto VARCHAR(150),
    p_precio_producto DECIMAL(10,2),
    p_stock_producto INT,
    p_id_categoria INT,
    p_id_proveedor INT,
    INOUT p_id_producto INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO producto (nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor)
    VALUES (p_nombre_producto, p_precio_producto, p_stock_producto, p_id_categoria, p_id_proveedor)
    RETURNING id_producto INTO p_id_producto;
    
    COMMIT;
END;
$$;


-- 3. sp_actualizar_stock: Modifica directamente el stock de un producto validando que no sea negativo
CREATE OR REPLACE PROCEDURE sp_actualizar_stock(
    p_id_producto INT,
    p_nuevo_stock INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nuevo_stock < 0 THEN
        RAISE EXCEPTION 'El stock no puede ser negativo.';
    END IF;

    UPDATE producto
    SET stock_producto = p_nuevo_stock
    WHERE id_producto = p_id_producto;

    COMMIT;
END;
$$;


-- 4. sp_eliminar_categoria_segura: Valida relaciones de integridad referencial antes de eliminar
CREATE OR REPLACE PROCEDURE sp_eliminar_categoria_segura(
    p_id_categoria INT,
    INOUT p_exito BOOLEAN,
    INOUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_conteo INT;
BEGIN
    -- Contar productos asociados
    SELECT COUNT(*) INTO v_conteo
    FROM producto
    WHERE id_categoria = p_id_categoria;

    IF v_conteo > 0 THEN
        p_exito := FALSE;
        p_mensaje := 'No se puede eliminar la categoría. Existen ' || v_conteo || ' productos asociados a ella.';
        ROLLBACK;
    ELSE
        DELETE FROM categoria
        WHERE id_categoria = p_id_categoria;
        p_exito := TRUE;
        p_mensaje := 'Categoría eliminada exitosamente.';
        COMMIT;
    END IF;
END;
$$;


-- 5. sp_crear_cliente: Crea o actualiza un cliente a partir de su NIT y retorna su ID
CREATE OR REPLACE PROCEDURE sp_crear_cliente(
    p_nombre_cliente VARCHAR(100),
    p_correo_cliente VARCHAR(100),
    p_nit_cliente VARCHAR(20),
    INOUT p_id_cliente INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Intentar obtener el id del cliente si el NIT ya existe
    SELECT id_cliente INTO p_id_cliente
    FROM cliente
    WHERE nit_cliente = p_nit_cliente;

    IF p_id_cliente IS NOT NULL THEN
        -- Actualizar información existente
        UPDATE cliente
        SET nombre_cliente = p_nombre_cliente,
            correo_cliente = COALESCE(p_correo_cliente, correo_cliente)
        WHERE id_cliente = p_id_cliente;
    ELSE
        -- Insertar nuevo cliente
        INSERT INTO cliente (nombre_cliente, correo_cliente, nit_cliente)
        VALUES (p_nombre_cliente, p_correo_cliente, p_nit_cliente)
        RETURNING id_cliente INTO p_id_cliente;
    END IF;
    
    COMMIT;
END;
$$;

-- 9. Otorgar permisos de ejecución de Stored Procedures a los roles
GRANT EXECUTE ON PROCEDURE sp_registrar_venta(INT, INT, INT[], INT[], INT, TEXT) TO rol_vendedor, rol_supervisor, rol_admin;
GRANT EXECUTE ON PROCEDURE sp_crear_cliente(VARCHAR, VARCHAR, VARCHAR, INT) TO rol_vendedor, rol_supervisor, rol_admin;
GRANT EXECUTE ON PROCEDURE sp_crear_producto(VARCHAR, DECIMAL, INT, INT, INT, INT) TO rol_supervisor, rol_inventario, rol_admin;
GRANT EXECUTE ON PROCEDURE sp_actualizar_stock(INT, INT) TO rol_supervisor, rol_inventario, rol_admin;
GRANT EXECUTE ON PROCEDURE sp_eliminar_categoria_segura(INT, BOOLEAN, TEXT) TO rol_supervisor, rol_inventario, rol_admin;