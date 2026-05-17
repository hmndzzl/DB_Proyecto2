# Sistema de Gestión de Ventas e Inventario (Proyecto 2 - Sistemas y Tecnologías Web)

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
- **React Context API & Hooks**: Manejo de estado global y patrones avanzados (`useReducer`, `useMemo`).
- **TypeScript**.
- **React Router DOM v6**: Para el enrutamiento protegido.
- **Vanilla CSS**: Estilos modernos con paleta de colores personalizada, modo oscuro para el sidebar y diseño responsivo.
- **Vitest & ESLint**: Entorno de pruebas unitarias y análisis estático de código.

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

## 🌐 Documentación de Endpoints (API REST)

La API cuenta con medidas de seguridad mediante middlewares (`authMiddleware`, `requireRole`), asegurando que solo usuarios autorizados accedan a rutas críticas. Se espera que las peticiones protegidas incluyan el header `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| **POST** | `/api/auth/login` | Inicio de sesión. Recibe `correo_empleado` y `password_empleado`. Devuelve JWT y datos del usuario. | Público |
| **GET** | `/api/ventas` | Devuelve el historial completo de ventas con detalle del cliente y empleado. | Admin |
| **POST** | `/api/ventas` | Crea una nueva venta. Aplica una **transacción explícita** para descontar stock y registrar al cliente si es nuevo. | Admin, Vendedor |
| **GET** | `/api/clientes/:nit` | Busca un cliente por NIT para autocompletar el formulario de nueva venta. | Admin, Vendedor |
| **GET** | `/api/productos` | Obtiene el catálogo completo de productos disponibles. | Admin, Vendedor |
| **POST** | `/api/productos` | Agrega un nuevo producto al inventario. | Admin |
| **PUT** | `/api/productos/:id` | Actualiza los datos de un producto (precio, stock, etc). | Admin |
| **DELETE**| `/api/productos/:id` | Elimina un producto. | Admin |
| **GET** | `/api/catalogos/categorias`| Lista las categorías de los productos. | Admin, Vendedor |
| **POST** | `/api/catalogos/categorias`| Crea una nueva categoría. | Admin |
| **PUT** | `/api/catalogos/categorias/:id`| Modifica una categoría existente. | Admin |
| **DELETE**| `/api/catalogos/categorias/:id`| Elimina una categoría. | Admin |
| **GET** | `/api/reportes/ventas` | Reporte general usando un `VIEW` (`vista_ventas_detalladas`) y funciones de agregación. | Admin |
| **GET** | `/api/reportes/empleados` | Top vendedores empleando `CTE (WITH)`. | Admin |
| **GET** | `/api/reportes/clientes-vip` | Clientes VIP mediante Subquery y `HAVING SUM()`. | Admin |
| **GET** | `/api/reportes/productos-sin-ventas` | Productos estancados usando Subquery correlacionado (`NOT EXISTS`). | Admin |
| **GET** | `/api/reportes/exportar/csv`| Exportación nativa del historial a archivo `.csv`. | Admin |

---

## 🧪 Pruebas Unitarias y Calidad de Código (Linter)

El proyecto incluye configuraciones estrictas para asegurar la mantenibilidad y estabilidad del frontend.

### Pruebas Unitarias (Vitest)
Se ha configurado un entorno de pruebas moderno utilizando **Vitest** y **React Testing Library**. 
Las pruebas se centran en la lógica compleja del negocio, como el estado global y los reductores (`useReducer`).
- Para ejecutar la suite de pruebas, dirígete a la carpeta `app/frontend` y ejecuta:
  ```bash
  npm run test
  ```
- *Ejemplo implementado:* `CartReducer.test.ts` valida el correcto funcionamiento de añadir, eliminar, sumar cantidades y limpiar el carrito de compras.

### Análisis Estático (ESLint)
El código de React ha sido estandarizado utilizando **ESLint** con un conjunto de reglas estrictas de TypeScript (`@typescript-eslint`) y React Hooks (`eslint-plugin-react-hooks`). 
- Para evaluar la calidad del código y detectar malas prácticas (como variables no utilizadas o hooks condicionales), ejecuta:
  ```bash
  npm run lint
  ```
- *Nota:* El proyecto se entrega con **0 advertencias y 0 errores** de linter, asegurando el máximo puntaje en calidad.

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