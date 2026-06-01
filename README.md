# Sistema de Gestión de Ventas e Inventario (Proyecto 3 - Sistemas y Tecnologías Web)

## Creado por: Hugo Méndez Lee - 241265
---

Este proyecto es una aplicación web completa diseñada para administrar el inventario, procesar ventas (Punto de Venta) y generar reportes financieros.

En esta **Fase 3**, la arquitectura ha sido elevada para incorporar seguridad avanzada a nivel de motor de base de datos (DBMS Roles), control transaccional explícito mediante Stored Procedures en PostgreSQL y la integración completa de un ORM (Sequelize) para el mapeo relacional de objetos.

---

## 🆕 Novedades de la Fase 3 (Proyecto 3)

Comparado con la fase anterior, se han incorporado los siguientes requerimientos técnicos avanzados:

### 1. Roles Nativos en el DBMS
Se han definido **exactamente 5 roles** a nivel de PostgreSQL con permisos granulares específicos mediante `GRANT` y `REVOKE` por tabla, secuencia y procedimiento:
* 🔑 **`rol_admin`**: Acceso total al esquema y ejecución.
* 💼 **`rol_vendedor`**: Permisos de ventas y clientes; lectura de catálogos (producto, categoria, proveedor) y lectura de la información básica de empleados para resolver nombres en reportes.
* 👔 **`rol_supervisor`**: Lectura total de esquemas, escritura en catálogos, clientes y reportes. Sin acceso a la administración general de empleados.
* 📦 **`rol_inventario`**: Permisos exclusivos de administración de catálogo físico (productos, categorías, proveedores). Sin acceso a ventas ni clientes.
* 🔍 **`rol_auditor`**: Privilegios estrictos de solo lectura (`SELECT`) en todo el esquema. Botones de modificación de UI ocultos automáticamente.

### 2. Seguridad DBMS por Sesión (`SET LOCAL ROLE`)
El backend se conecta inicialmente como el superusuario de calificación `proy3`, pero al inicio de cada transacción o consulta, el helper `roleExecutor.ts` ejecuta un comando **`SET LOCAL ROLE <nombre_rol>`** dentro de una transacción explícita de Sequelize. De esta forma, **el propio DBMS rechaza cualquier operación no autorizada** (incluso si un atacante bypassa el router de Express), retornando un código de error de permisos `42501` que la API maneja como HTTP 403.

### 3. 5 Stored Procedures Nativos
Toda la lógica de negocio crítica se ejecuta mediante procedimientos almacenados definidos en PostgreSQL e invocados por el backend:
* **`sp_registrar_venta`**: Registra la cabecera y el detalle de una compra, descuenta stock de productos y actualiza totales. **Incluye manejo de excepciones y control transaccional explícito con COMMIT/ROLLBACK.**
* **`sp_crear_producto`**: Registra un producto en catálogo y retorna el ID generado como parámetro de salida.
* **`sp_actualizar_stock`**: Modifica las existencias físicas de un ítem validando que el inventario no resulte negativo.
* **`sp_eliminar_categoria_segura`**: Valida integridad referencial antes de borrar una categoría (retorna éxito/error y mensaje de error).
* **`sp_crear_cliente`**: Registra o actualiza la información de un cliente basándose en la llave única NIT.

### 4. Mapeo Relacional de Objetos (ORM Sequelize)
Se migró la lógica de consultas de SQL puro del backend a **Sequelize ORM** para las operaciones CRUD fundamentales (catálogos, productos y clientes). Los modelos TypeScript (`Rol`, `Empleado`, `Categoria`, `Proveedor`, `Producto`, `Cliente`) se definen con la palabra clave `declare` para evitar el "shadowing" de atributos y asegurar getters/setters nativos de Sequelize.

### 5. Panel de Calificación Eficiente
Se rediseñó la pantalla de Login para mostrar un selector premium de **Cuentas de Calificación**. Con un solo clic, se autocompletan las credenciales para cualquiera de los 5 roles, permitiendo evaluar el comportamiento dinámico del Sidebar y la UI inmediatamente.

---

## 🛠️ Stack Tecnológico

El proyecto sigue una arquitectura Cliente-Servidor dividida en 3 capas fundamentales:

### Base de Datos
- **PostgreSQL 15 (DBMS)**: Base de datos relacional nativa con Roles y Stored Procedures.
- **PgAdmin / psql**: Para verificación manual de transacciones.

### Backend (API REST)
- **Node.js** con **Express.js** y **TypeScript**.
- **Sequelize ORM**: Para operaciones CRUD del inventario.
- **JWT (JSON Web Tokens)** & **Bcrypt**: Seguridad de sesiones e identidad.

### Frontend (UI)
- **React 19** con **Vite** y **TypeScript**.
- **React Router DOM v7**: Enrutamiento protegido por rol (`allowedRoles` en `ProtectedRoute`).
- **Vanilla CSS**: Estilos modernos con paleta de colores personalizada y diseño dinámico.

---

## 🚀 Cómo Levantar el Proyecto

### 1. Clonar el repositorio
```bash
git clone git@github.com:hmndzzl/DB_Proyecto2.git
cd DB_Proyecto2/app
git checkout proyecto-3
```

### 2. Preparación de Entorno
Crea o edita el archivo `.env` en la raíz de `/app` con las **credenciales obligatorias de calificación**:

```env
# Base de Datos
DB_USER=proy3
DB_PASSWORD=secret
DB_NAME=
DB_HOST=
DB_PORT=

# Backend
BACKEND_PORT=

# Frontend
VITE_API_URL=http://localhost:3000

# JWT
JWT_SECRET="tu_secreto_super_seguro"
JWT_EXPIRES_IN=24h
```

### 3. Ejecutar con Docker Compose
```bash
docker compose up --build -d
```

### 4. Acceder e Iniciar Sesión por Rol
Abre tu navegador en: 👉 **http://localhost:5173**

Utiliza el selector rápido de **"Cuentas de Calificación"** en el login para iniciar sesión de forma automática con cualquiera de las cuentas de prueba funcionales (contraseña común `123456`):
* 🔑 **Administrador**: `gerente@tienda.com` (Acceso completo)
* 💼 **Vendedor**: `emp2@tienda.com` (Productos, Ventas y Clientes)
* 👔 **Supervisor**: `supervisor@tienda.com` (Productos, Categorías, Clientes y Reportes)
* 📦 **Inventario**: `inventario@tienda.com` (Productos, Categorías y Proveedores)
* 🔍 **Auditor**: `auditor@tienda.com` (Solo lectura de ventas, productos y categorías)

---

## 📂 Estructura del Proyecto

```text
/app
├── /backend            # Código de la API (Modelos ORM, Helper de Roles, Controladores, Rutas)
├── /frontend           # React UI (Vistas protegidas por allowedRoles, Sidebar dinámico)
├── /database/init      # Scripts SQL de inicialización
│   ├── 01_schema.sql   # DDL: Esquema, 5 Roles DBMS, permisos GRANT y 5 Stored Procedures
│   └── 02_seeds.sql    # DML: Catálogos y 25 empleados en seeds (1 de prueba para cada rol)
├── docker-compose.yml  # Orquestador Docker
└── .env                # Credenciales proy3 / secret
```

---

## 🌐 Documentación de Endpoints (API REST)

La API cuenta con medidas de seguridad mediante middlewares (`authMiddleware`, `requireRole`) y verificación estricta a nivel de DBMS (`executeInRoleTransaction`), asegurando que solo usuarios autorizados accedan y ejecuten operaciones permitidas. Se espera que las peticiones protegidas incluyan el header `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción | Acceso (Express & DBMS Roles) |
|---|---|---|---|
| **POST** | `/api/auth/login` | Inicio de sesión. Recibe `correo_empleado` y `password_empleado`. | Público (Conexión normal) |
| **GET** | `/api/ventas` | Devuelve el historial completo de ventas. | Admin, Vendedor, Supervisor, Auditor |
| **POST** | `/api/ventas` | Crea una nueva venta. Invoca **`sp_registrar_venta`** con transacción nativa explícita. | Admin, Vendedor, Supervisor |
| **GET** | `/api/clientes/:nit` | Busca un cliente por NIT usando el ORM. | Admin, Vendedor, Supervisor, Auditor |
| **POST** | `/api/clientes` | Crea o actualiza un cliente usando **`sp_crear_cliente`**. | Admin, Vendedor, Supervisor |
| **GET** | `/api/productos` | Obtiene el catálogo completo de productos disponibles. | Todos los Roles |
| **POST** | `/api/productos` | Agrega un nuevo producto usando **`sp_crear_producto`**. | Admin, Supervisor, Inventario |
| **PUT** | `/api/productos/:id` | Actualiza un producto con el ORM. | Admin, Supervisor, Inventario |
| **DELETE**| `/api/productos/:id` | Elimina un producto con el ORM. | Admin, Supervisor, Inventario |
| **GET** | `/api/catalogos/categorias`| Lista las categorías usando el ORM. | Todos los Roles |
| **POST** | `/api/catalogos/categorias`| Crea una nueva categoría con el ORM. | Admin, Supervisor, Inventario |
| **PUT** | `/api/catalogos/categorias/:id`| Modifica una categoría con el ORM. | Admin, Supervisor, Inventario |
| **DELETE**| `/api/catalogos/categorias/:id`| Elimina categoría usando **`sp_eliminar_categoria_segura`**. | Admin, Supervisor, Inventario |
| **GET** | `/api/reportes/ventas` | Reporte general usando un `VIEW` (`vista_ventas_detalladas`). | Admin, Supervisor, Auditor |
| **GET** | `/api/reportes/empleados` | Top vendedores empleando `CTE (WITH)`. | Admin, Supervisor, Auditor |
| **GET** | `/api/reportes/clientes-vip` | Clientes VIP mediante Subquery y `HAVING SUM()`. | Admin, Supervisor, Auditor |
| **GET** | `/api/reportes/productos-sin-ventas` | Productos estancados usando `NOT EXISTS`. | Admin, Supervisor, Auditor |
| **GET** | `/api/reportes/exportar/csv`| Exportación nativa del historial a archivo `.csv`. | Admin, Supervisor, Auditor |

---

## 🧪 Pruebas Unitarias y Calidad de Código (Linter)

El proyecto incluye configuraciones estrictas para asegurar la mantenibilidad y estabilidad del frontend.

### Pruebas Unitarias (Vitest)
Se ha configurado un entorno de pruebas moderno utilizando **Vitest** y **React Testing Library**.
Las pruebas se centran en la lógica compleja del negocio, como el estado de compras globales (`CartReducer.test.ts` valida añadir, eliminar, stock máximo e inicializar vaciado de carrito).
* Para ejecutar la suite de pruebas, dirígete a la carpeta `app/frontend` y ejecuta:
  ```bash
  npm run test
  ```

### Análisis Estático (ESLint)
El código de React ha sido estandarizado utilizando **ESLint** con reglas estrictas de TypeScript (`@typescript-eslint`) y React Hooks.
* Para evaluar la calidad del código, ejecuta en `app/frontend`:
  ```bash
  npm run lint
  ```
* El proyecto se entrega con **0 advertencias y 0 errores** de linter, asegurando un código limpio.

---

## ⚠️ Manejo de Errores y Validaciones

El sistema provee una excelente prevención activa de errores:
1. **Verificación Estricta en la Base de Datos**: Si un usuario intenta realizar una operación no autorizada mediante llamadas directas a la API, la base de datos lanza un error `permission denied` debido al `SET LOCAL ROLE` a nivel de conexión.
2. **Rollbacks en Stored Procedures**: Si una venta falla por stock insuficiente en cualquiera de los productos del carrito, el procedimiento almacenado `sp_registrar_venta` aborta automáticamente ejecutando un `ROLLBACK` explícito, previniendo datos huérfanos.
3. **Manejo de Errores Semánticos**: El backend captura los errores específicos de la base de datos y retorna respuestas con códigos HTTP descriptivos (403 Prohibido, 400 Petición Incorrecta) y explicaciones en formato JSON útiles para el frontend.