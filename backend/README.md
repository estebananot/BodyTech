# Backend - Mini Gestor de Tareas API

## Descripción
API REST con autenticación JWT para gestionar tareas de usuarios. Construida con Slim Framework.

Soporta **SQLite**, **MySQL** y **PostgreSQL**.

---

## Configuración

### Variables de Entorno (.env)

```env
# Base de datos: sqlite, mysql, o pgsql
DB_CONNECTION=sqlite

# SQLite
DB_DATABASE=database/db.sqlite

# MySQL (descomentar y configurar)
# DB_CONNECTION=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_DATABASE=mini_task_manager
# DB_USERNAME=root
# DB_PASSWORD=secret

# PostgreSQL (descomentar y configurar)
# DB_CONNECTION=pgsql
# DB_HOST=localhost
# DB_PORT=5432
# DB_DATABASE=mini_task_manager
# DB_USERNAME=root
# DB_PASSWORD=secret

# JWT
JWT_SECRET=hv2u0SyrKSk4CyJkUdsX39gdwZ1SlZP8s3eMhQtvUZm3i9N3yJTv3oquiDhugo-U
JWT_EXPIRATION=86400
```

### Instalar Dependencias
```bash
cd backend
composer install
```

### Inicializar Base de Datos (SQLite)
```bash
php database/Setup.php
```

### Iniciar Servidor (SQLite)
```bash
cd backend
php -S localhost:8000 -t public/
```

---

## Docker (PostgreSQL)

### Iniciar con Docker
```bash
cd backend

# Opción 1: PostgreSQL (recomendado)
docker-compose up -d

# Verificar que los contenedores están corriendo
docker ps
```

### Verificar que funciona
```bash
# Verificar PostgreSQL
docker exec task_manager_db psql -U root -d mini_task_manager -c "SELECT 1;"

# Verificar API
curl http://localhost:8000/api/login -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```

### Detener contenedores
```bash
docker-compose down

# Detener y eliminar volúmenes (borra datos)
docker-compose down -v
```

---

## Esquema de Base de Datos

### MySQL
```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'done') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### PostgreSQL
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'done')) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Endpoints

### Autenticación

#### POST /api/register
Registra un nuevo usuario.

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Responses:**
- `201` - Éxito
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 4,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

- `400` - Error de validación
```json
{
  "success": false,
  "message": "Datos incompletos"
}
```
```json
{
  "success": false,
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

#### POST /api/login
Autentica un usuario y retorna un token JWT.

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Responses:**
- `200` - Éxito
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 4,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
}
```

- `401` - Credenciales incorrectas
```json
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

---

### Tareas (Requieren Autenticación)

**Header requerido:**
```
Authorization: Bearer {token}
```

---

#### GET /api/tasks
Lista todas las tareas del usuario autenticado.

**Query Parameters (opcionales):**
- `status` - Filtrar por estado: `pending`, `in_progress`, `done`

**Responses:**
- `200` - Éxito
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 4,
      "title": "Completar prueba técnica",
      "description": "Desarrollar mini gestor de tareas",
      "status": "pending",
      "created_at": "2026-02-06 17:27:05",
      "updated_at": "2026-02-06 17:27:05"
    }
  ]
}
```

- `401` - No autorizado
```json
{
  "success": false,
  "message": "No autorizado"
}
```

---

#### POST /api/tasks
Crea una nueva tarea.

**Request:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "status": "pending"
}
```
- `status` es opcional, default: `pending`

**Responses:**
- `201` - Éxito
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "id": 2,
    "user_id": 4,
    "title": "Nueva tarea",
    "description": "Descripción opcional",
    "status": "pending",
    "created_at": "2026-02-06 18:00:00",
    "updated_at": "2026-02-06 18:00:00"
  }
}
```

- `400` - Error de validación
```json
{
  "success": false,
  "message": "El título es requerido"
}
```

- `401` - No autorizado
```json
{
  "success": false,
  "message": "No autorizado"
}
```

---

#### PUT /api/tasks/{id}
Actualiza una tarea existente.

**Request:**
```json
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "status": "done"
}
```
- Todos los campos son opcionales

**Responses:**
- `200` - Éxito
```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": {
    "id": 2,
    "user_id": 4,
    "title": "Título actualizado",
    "description": "Nueva descripción",
    "status": "done",
    "created_at": "2026-02-06 18:00:00",
    "updated_at": "2026-02-06 18:30:00"
  }
}
```

- `401` - No autorizado
- `404` - Tarea no encontrada

---

#### DELETE /api/tasks/{id}
Elimina una tarea.

**Responses:**
- `200` - Éxito
```json
{
  "success": true,
  "message": "Tarea eliminada"
}
```

- `401` - No autorizado
- `404` - Tarea no encontrada

---

## Códigos HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Error de validación |
| 401 | No autorizado (token inválido o expirado) |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |

---

## Formato de Token JWT

El token JWT contiene:
```json
{
  "iss": "mini-task-manager",
  "sub": 4,
  "iat": 1730398851,
  "exp": 1730485251
}
```

- `sub`: ID del usuario
- `iat`: Timestamp de emisión
- `exp`: Timestamp de expiración (24 horas)

---

## Estructura del Proyecto

```
backend/
├── app/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   └── TaskController.php
│   └── Database.php
├── database/
│   ├── init.sql           # PostgreSQL
│   ├── init.mysql.sql     # MySQL
│   └── Setup.php
├── public/
│   └── index.php
├── tests/
├── .env
├── .env.example
├── composer.json
├── docker-compose.yml           # PostgreSQL
├── docker-compose.mysql.yml     # MySQL
└── Dockerfile
```

---

## Notas para Frontend

1. **Al hacer login:** Guardar el `token` en localStorage o cookies
2. **Para cada request:** Incluir header `Authorization: Bearer {token}`
3. **Si token expira o es inválido:** Mostrar mensaje y redirigir a login
4. **Estados de tarea:** `pending`, `in_progress`, `done`
5. **Filtrar tareas:** Usar query param `?status=pending`
6. **Tipos de datos:**
   - `id` de usuario y tarea son enteros
   - `user_id` es entero
   - `status` es string: `pending`, `in_progress`, `done`
   - Fechas son strings en formato `YYYY-MM-DD HH:MM:SS`

---

## Testing

```bash
cd backend
php vendor/bin/phpunit              # Todos los tests
php vendor/bin/phpunit --testdox    # Formato legible
```

---

## Producción

### Variables de entorno requeridas:
```env
DB_CONNECTION=pgsql  # o mysql
DB_HOST=localhost
DB_PORT=5432  # 3306 para MySQL
DB_DATABASE=mini_task_manager
DB_USERNAME=root
DB_PASSWORD=tu_password_seguro
JWT_SECRET=cambiar_por_un_string_muy_largo_y_seguro
JWT_EXPIRATION=86400
```
