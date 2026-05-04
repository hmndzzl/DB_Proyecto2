-- ==============================================================================
-- PROYECTO 2 - Bases de Datos 1
-- Hugo Méndez Lee - 241265
-- ==============================================================================

-- ==============================================================================
-- INSERCIÓN DE DATOS DE PRUEBA
-- ==============================================================================

-- 1. CATEGORÍAS (25 registros)
INSERT INTO categoria (nombre_categoria, descripcion_categoria) VALUES
('Electrónica', 'Dispositivos y gadgets'), ('Línea Blanca', 'Electrodomésticos grandes'),
('Computación', 'Laptops y accesorios'), ('Celulares', 'Smartphones'),
('Audio', 'Bocinas y audífonos'), ('Video', 'Televisores y proyectores'),
('Consolas', 'Videojuegos y accesorios'), ('Cámaras', 'Fotografía digital'),
('Hogar', 'Muebles y decoración'), ('Ferretería', 'Herramientas manuales'),
('Jardinería', 'Plantas y herramientas'), ('Deportes', 'Equipamiento deportivo'),
('Ropa Hombre', 'Vestimenta masculina'), ('Ropa Mujer', 'Vestimenta femenina'),
('Calzado', 'Zapatos y tenis'), ('Juguetes', 'Diversión para niños'),
('Libros', 'Literatura y educación'), ('Papelería', 'Útiles escolares'),
('Mascotas', 'Alimentos y accesorios'), ('Salud', 'Farmacia y cuidado'),
('Belleza', 'Cuidado personal'), ('Automotriz', 'Repuestos y accesorios'),
('Bebidas', 'Jugos y sodas'), ('Licores', 'Bebidas alcohólicas'),
('Abarrotes', 'Despensa general');

-- 2. PROVEEDORES (25 registros)
INSERT INTO proveedor (nombre_proveedor) VALUES
('TechGlobal'), ('ElectroMax'), ('CompuMayoristas'), ('Móviles del Sur'),
('AudioPro'), ('VisionTech'), ('GamerZone'), ('FotoClick'),
('DecoraHogar'), ('Herramientas Fijas'), ('VerdeJardín'), ('FitSupply'),
('ModaH'), ('ModaM'), ('Zapatos Express'), ('Juguetería Central'),
('Editorial Leo'), ('Lápiz y Papel'), ('PetCare'), ('FarmaSalud'),
('Cosmetics Corp'), ('AutoParts'), ('Refrescos Nacionales'), ('Licores del Valle'),
('Distribuidora Central');

-- 3. CLIENTES (25 registros)
INSERT INTO cliente (nombre_cliente, correo_cliente, nit_cliente) VALUES
('Juan Pérez', 'juan.perez@mail.com', '1001-A'), ('María López', 'maria.l@mail.com', '1002-B'),
('Carlos Gómez', 'cgomez@mail.com', '1003-C'), ('Ana Martínez', 'ana.m@mail.com', '1004-D'),
('Luis Fernández', 'luisf@mail.com', '1005-E'), ('Laura García', 'laura.g@mail.com', '1006-F'),
('Pedro Sánchez', 'pedros@mail.com', '1007-G'), ('Carmen Díaz', 'carmen.d@mail.com', '1008-H'),
('Jorge Ruiz', 'jruiz@mail.com', '1009-I'), ('Sofía Torres', 'sofia.t@mail.com', '1010-J'),
('Diego Flores', 'dflores@mail.com', '1011-K'), ('Lucía Ramírez', 'lucia.r@mail.com', '1012-L'),
('Fernando Cruz', 'fcruz@mail.com', '1013-M'), ('Elena Morales', 'elena.m@mail.com', '1014-N'),
('Andrés Ortiz', 'aortiz@mail.com', '1015-O'), ('Paula Castillo', 'paula.c@mail.com', '1016-P'),
('Miguel Reyes', 'mreyes@mail.com', '1017-Q'), ('Rosa Silva', 'rosa.s@mail.com', '1018-R'),
('Javier Mendoza', 'jmendoza@mail.com', '1019-S'), ('Silvia Vargas', 'silvia.v@mail.com', '1020-T'),
('Ricardo Ríos', 'rrios@mail.com', '1021-U'), ('Patricia Castro', 'patricia.c@mail.com', '1022-V'),
('Roberto Aguilar', 'raguilar@mail.com', '1023-W'), ('Mónica Navarro', 'monica.n@mail.com', '1024-X'),
('Hugo Delgado', 'hdelgado@mail.com', '1025-Y');

-- 4. Roles (2 roles)
INSERT INTO rol (nombre_rol) VALUES ('Administrador'), ('Vendedor');

-- 5. EMPLEADOS (25 registros, ID 1 es el gerente)
-- 5. EMPLEADOS (25 registros, ID 1 es el gerente)
-- Nota: La contraseña para todos los usuarios es '123456'
-- id_rol: 1 (Administrador), 2 (Vendedor)
INSERT INTO empleado (nombre_empleado, correo_empleado, password_empleado, fecha_contratacion, id_rol, id_encargado) VALUES
('Carlos Valdez', 'gerente@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2020-01-01', 1, NULL),
('Luis Arana', 'emp2@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-02-15', 2, 1),
('María José Pinto', 'emp3@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-03-20', 2, 1),
('Ana Lima', 'emp4@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-04-10', 2, 1),
('Pedro Paz', 'emp5@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-05-05', 2, 1),
('Juan Santos', 'emp6@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-06-12', 2, 2),
('Marta Silva', 'emp7@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-07-22', 2, 2),
('Julia Reyes', 'emp8@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-08-30', 2, 2),
('Pablo Soto', 'emp9@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-09-14', 2, 3),
('Karla Mota', 'emp10@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-10-01', 2, 3),
('Luis Pineda', 'emp11@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-11-11', 2, 3),
('Carmen Vaca', 'emp12@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2021-12-05', 2, 4),
('Rosa Milla', 'emp13@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-01-18', 2, 4),
('Hugo Prado', 'emp14@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-02-25', 2, 4),
('Paco Lira', 'emp15@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-03-08', 2, 5),
('Luz Rivas', 'emp16@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-04-14', 2, 5),
('Omar Toro', 'emp17@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-05-20', 2, 5),
('José Mora', 'emp18@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-06-30', 2, 2),
('Sara Cruz', 'emp19@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-07-07', 2, 2),
('Raúl Pina', 'emp20@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-08-16', 2, 3),
('Dora Vega', 'emp21@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-09-21', 2, 3),
('Saúl Cano', 'emp22@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-10-29', 2, 4),
('Rita Ríos', 'emp23@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-11-15', 2, 4),
('Joel Mazo', 'emp24@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2022-12-02', 2, 5),
('Emma Luna', 'emp25@tienda.com', '$2b$10$k1wJ/4B9T.8D5w5O5q5O1o9.o5.o5.o5.o5.o5.o5.o5.o5.o5.o5', '2023-01-10', 2, 5);

-- 6. TELÉFONOS PROVEEDORES (25 registros)
INSERT INTO telefonos_proveedores (telefono_proveedor, id_proveedor) VALUES
('555-1001', 1), ('555-1002', 2), ('555-1003', 3), ('555-1004', 4), ('555-1005', 5),
('555-1006', 6), ('555-1007', 7), ('555-1008', 8), ('555-1009', 9), ('555-1010', 10),
('555-1011', 11), ('555-1012', 12), ('555-1013', 13), ('555-1014', 14), ('555-1015', 15),
('555-1016', 16), ('555-1017', 17), ('555-1018', 18), ('555-1019', 19), ('555-1020', 20),
('555-1021', 21), ('555-1022', 22), ('555-1023', 23), ('555-1024', 24), ('555-1025', 25);

-- 7. TELÉFONOS CLIENTES (25 registros)
INSERT INTO telefonos_clientes (telefono_cliente, id_cliente) VALUES
('444-2001', 1), ('444-2002', 2), ('444-2003', 3), ('444-2004', 4), ('444-2005', 5),
('444-2006', 6), ('444-2007', 7), ('444-2008', 8), ('444-2009', 9), ('444-2010', 10),
('444-2011', 11), ('444-2012', 12), ('444-2013', 13), ('444-2014', 14), ('444-2015', 15),
('444-2016', 16), ('444-2017', 17), ('444-2018', 18), ('444-2019', 19), ('444-2020', 20),
('444-2021', 21), ('444-2022', 22), ('444-2023', 23), ('444-2024', 24), ('444-2025', 25);

-- 8. TELÉFONOS EMPLEADOS (25 registros)
INSERT INTO telefonos_empleados (telefono_empleado, id_empleado) VALUES
('333-3001', 1), ('333-3002', 2), ('333-3003', 3), ('333-3004', 4), ('333-3005', 5),
('333-3006', 6), ('333-3007', 7), ('333-3008', 8), ('333-3009', 9), ('333-3010', 10),
('333-3011', 11), ('333-3012', 12), ('333-3013', 13), ('333-3014', 14), ('333-3015', 15),
('333-3016', 16), ('333-3017', 17), ('333-3018', 18), ('333-3019', 19), ('333-3020', 20),
('333-3021', 21), ('333-3022', 22), ('333-3023', 23), ('333-3024', 24), ('333-3025', 25);

-- 9. PRODUCTOS (25 registros)
INSERT INTO producto (nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor) VALUES
('Smart TV 55', 4500.00, 10, 6, 6), ('Laptop Pro 15', 8500.00, 15, 3, 3),
('iPhone 14', 7500.00, 20, 4, 4), ('Bocina Bluetooth', 850.00, 30, 5, 5),
('Refrigeradora 12p', 3500.00, 8, 2, 2), ('PlayStation 5', 5500.00, 12, 7, 7),
('Cámara Reflex', 6000.00, 5, 8, 8), ('Sofá 3 plazas', 2500.00, 4, 9, 9),
('Taladro Inalámbrico', 1200.00, 25, 10, 10), ('Set de Jardinería', 300.00, 40, 11, 11),
('Bicicleta Montaña', 1800.00, 15, 12, 12), ('Camisa Formal', 250.00, 50, 13, 13),
('Vestido Noche', 400.00, 30, 14, 14), ('Tenis Running', 600.00, 45, 15, 15),
('Lego Star Wars', 800.00, 20, 16, 16), ('Libro Clean Code', 350.00, 15, 17, 17),
('Cuaderno Universitario', 25.00, 200, 18, 18), ('Comida Perro 20kg', 450.00, 25, 19, 19),
('Vitamina C', 120.00, 100, 20, 20), ('Crema Hidratante', 150.00, 60, 21, 21),
('Llantas R15', 550.00, 40, 22, 22), ('Juego de Ollas', 850.00, 15, 9, 9),
('Pack Cerveza', 150.00, 80, 24, 24), ('Vino Tinto', 250.00, 35, 24, 24),
('Cereal Familiar', 45.00, 120, 25, 25);

-- 10. VENTAS (25 registros)
-- Para simplificar el cuadre contable del seed, cada venta tendrá un solo producto.
INSERT INTO venta (id_cliente, id_empleado, total_venta) VALUES
(1, 2, 4500.00), (2, 3, 8500.00), (3, 4, 7500.00), (4, 5, 850.00), (5, 6, 3500.00),
(6, 7, 5500.00), (7, 8, 6000.00), (8, 9, 2500.00), (9, 10, 1200.00), (10, 11, 300.00),
(11, 12, 1800.00), (12, 13, 250.00), (13, 14, 400.00), (14, 15, 600.00), (15, 16, 800.00),
(16, 17, 350.00), (17, 18, 25.00), (18, 19, 450.00), (19, 20, 120.00), (20, 21, 150.00),
(21, 22, 550.00), (22, 23, 850.00), (23, 24, 150.00), (24, 25, 250.00), (25, 2, 45.00);

-- 11. DETALLE DE VENTAS (25 registros - Cuadrados matemáticamente)
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 4500.00, 4500.00), (2, 2, 1, 8500.00, 8500.00), (3, 3, 1, 7500.00, 7500.00),
(4, 4, 1, 850.00, 850.00), (5, 5, 1, 3500.00, 3500.00), (6, 6, 1, 5500.00, 5500.00),
(7, 7, 1, 6000.00, 6000.00), (8, 8, 1, 2500.00, 2500.00), (9, 9, 1, 1200.00, 1200.00),
(10, 10, 1, 300.00, 300.00), (11, 11, 1, 1800.00, 1800.00), (12, 12, 1, 250.00, 250.00),
(13, 13, 1, 400.00, 400.00), (14, 14, 1, 600.00, 600.00), (15, 15, 1, 800.00, 800.00),
(16, 16, 1, 350.00, 350.00), (17, 17, 1, 25.00, 25.00), (18, 18, 1, 450.00, 450.00),
(19, 19, 1, 120.00, 120.00), (20, 20, 1, 150.00, 150.00), (21, 21, 1, 550.00, 550.00),
(22, 22, 1, 850.00, 850.00), (23, 23, 1, 150.00, 150.00), (24, 24, 1, 250.00, 250.00),
(25, 25, 1, 45.00, 45.00);