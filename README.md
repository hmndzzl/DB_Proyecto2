# Sistema de Gestión de Ventas e Inventario (Proyecto 2 - Bases de Datos 1)

## Creado por: Hugo Méndez Lee - 241265
---

Este proyecto es una aplicación web completa diseñada para administrar el inventario, procesar ventas (Punto de Venta) y generar reportes financieros.

## 🛠️ Stack Tecnológico

El proyecto sigue una arquitectura Cliente-Servidor dividida en 3 capas fundamentales:

### Base de Datos
- **PostgreSQL 15**: Sistema gestor de base de datos relacional.
- **PgAdmin / psql**: Para verificación manual.
- Las consultas están estructuradas hasta en la 3ra Forma Normal (3FN) con índices, vistas y datos de prueba automáticos.

### Backend (API REST)
- **Node.js** con **Express.js**.
- **TypeScript** para un tipado estricto.
- **node-postgres (`pg`)**: Driver nativo para ejecutar SQL puro.
- **JWT (JSON Web Tokens)**: Para autenticación segura basada en sesiones.
- **Bcrypt**: Para encriptación segura de contraseñas.

### Frontend (UI)
- **React 18** con **Vite**.
- **TypeScript**.
- **React Router DOM v6**: Para el enrutamiento protegido.
- **Vanilla CSS**: Estilos modernos con paleta de colores personalizada, modo oscuro para el sidebar y diseño responsivo.

### Infraestructura
- **Docker** y **Docker Compose** para orquestación de contenedores.

---

## 🚀 Cómo Levantar el Proyecto

Todo el ecosistema está configurado para ejecutarse con un solo comando gracias a Docker.

### 1. Clonar el repositorio
```bash
git clone git@github.com:hmndzzl/DB_Proyecto2.git
```

### 2. Preparación de Entorno
Asegúrese de tener Docker y Docker Compose instalados en su máquina.
1. Ingrese a la carpeta principal de la aplicación:
   ```bash
   cd app
   ```
2. Verifique las variables de entorno. Asegúrese de que existe un archivo `.env` configurado que cumpla con las credenciales obligatorias para calificación. Puede usar el archivo `.env_example` como referencia:

   ```env
   # Base de Datos
   DB_USER=proy2
   DB_PASSWORD=secret
   DB_NAME=tienda_db
   DB_HOST=db
   DB_PORT=5432

   # Backend
   BACKEND_PORT=3000

   # Frontend
   VITE_API_URL=http://localhost:3000

   # JWT
   JWT_SECRET=tu_secreto_super_seguro
   JWT_EXPIRES_IN=24h
   ```

### 3. Ejecutar con Docker
Ejecute el siguiente comando para levantar la base de datos, el backend y el frontend de forma simultánea:

```bash
docker compose up --build 
```

### 4. Acceder a la Aplicación
Una vez que los contenedores estén corriendo, abra su navegador e ingrese a:
👉 **http://localhost:5173**

### 5. Credenciales de Acceso (Ejemplo)
- **Administrador:** `gerente@tienda.com` / `123456`
- **Vendedor:** `emp2@tienda.com` / `123456`

*(La base de datos cuenta con 25 empleados en total, todos con la contraseña `123456`).*

---

## 📂 Estructura del Proyecto

```text
/app
├── /backend            # Código fuente de la API (Controladores, Rutas, Middlewares)
├── /frontend           # Código fuente de React (Páginas, Componentes, Assets)
├── /database/init      # Scripts SQL de inicialización automática
│   ├── 01_schema.sql   # DDL: Tablas, Relaciones, Vistas e Índices
│   └── 02_seeds.sql    # DML: Datos de prueba (25 registros/tabla min.)
├── docker-compose.yml  # Orquestador principal
└── .env                # Variables de entorno
```

---

## 🌐 Endpoints Principales (API REST)

La API cuenta con medidas de seguridad mediante middlewares (`authMiddleware`, `requireRole`), asegurando que solo usuarios autorizados accedan a rutas críticas.

### Autenticación
- `POST /api/auth/login` → Inicio de sesión (Retorna JWT).

### Ventas y POS
- `POST /api/ventas` → Crea una venta aplicando una **transacción explícita** (`BEGIN`, `COMMIT`, `ROLLBACK`). Identifica automáticamente si es un cliente nuevo y deduce el inventario del carrito en un solo bloque.
- `GET /api/ventas` → Devuelve el historial completo (Protegido: Solo Admin).
- `GET /api/clientes/:nit` → Busca un cliente por NIT para autocompletar el POS.

### Entidades (CRUDs)
- `GET, POST, PUT, DELETE /api/productos` → CRUD completo del inventario.
- `GET, POST, PUT, DELETE /api/catalogos/categorias` → CRUD completo de clasificaciones.

### Reportes (SQL Avanzado)
- `GET /api/reportes/ventas` → Reporte general usando un `VIEW` (`vista_ventas_detalladas`) y agregaciones.
- `GET /api/reportes/empleados` → Top vendedores empleando `CTE (WITH)`.
- `GET /api/reportes/clientes-vip` → Subquery y `HAVING SUM()`.
- `GET /api/reportes/productos-sin-ventas` → Subquery correlacionado (`NOT EXISTS`).
- `GET /api/reportes/exportar/csv` → Exportación nativa del historial a archivo `.csv`.

---

## ⚠️ Manejo de Errores y Validaciones

El sistema provee una excelente experiencia al usuario mediante la prevención activa de errores:
1. **Frontend:**
   - Alertas visuales dinámicas al intentar vender más cantidad del stock disponible.
   - Restricciones de rutas (`<ProtectedRoute>`). Si un Vendedor intenta acceder al Dashboard, es redirigido automáticamente a la vista de Productos.
2. **Backend:**
   - **Rollbacks en transacciones:** Si un solo producto del carrito falla al guardarse (ej. stock insuficiente), el bloque completo falla y la BD vuelve a su estado original evitando datos huérfanos.
   - Códigos HTTP semánticos (401 No Autorizado, 403 Prohibido, 404 No Encontrado, 500 Error de Servidor) con mensajes en formato JSON fáciles de procesar.
3. **Base de Datos:**
   - Restricciones (`NOT NULL`, `UNIQUE`) y llaves foráneas en cascada/restricción para mantener la integridad referencial.