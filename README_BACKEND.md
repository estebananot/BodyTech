# Backend - Mini Gestor de Tareas API

## Descripción
API REST construida con PHP (Phalcon PHP preferiblemente) para gestionar tareas de usuarios con sistema de autenticación mediante JWT.

## Requisitos Técnicos

### Stack Tecnológico
- **PHP**: 8.1 o superior
- **Framework**: Phalcon PHP 5.x (preferible) o Laravel/Symfony como alternativa
- **Base de datos**: MySQL 8.0 o PostgreSQL 14+
- **Autenticación**: JWT (JSON Web Tokens)
- **Gestor de dependencias**: Composer

### Dependencias Principales
```json
{
  "require": {
    "firebase/php-jwt": "^6.0",
    "vlucas/phpdotenv": "^5.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.0"
  }
}
```

## Estructura del Proyecto

```
backend/
├── app/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   └── TaskController.php
│   ├── Models/
│   │   ├── User.php
│   │   └── Task.php
│   ├── Middleware/
│   │   └── AuthMiddleware.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   └── TaskService.php
│   └── Validators/
│       ├── UserValidator.php
│       └── TaskValidator.php
├── config/
│   ├── database.php
│   └── routes.php
├── database/
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   └── 002_create_tasks_table.sql
│   └── seeds/
│       └── seed_data.sql
├── public/
│   └── index.php
├── tests/
│   ├── Unit/
│   └── Integration/
├── .env.example
├── .gitignore
├── composer.json
├── docker-compose.yml (opcional)
└── README.md
```

## Esquema de Base de Datos

### Tabla: users
```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabla: tasks
```sql
CREATE TABLE tasks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'done') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Endpoints de la API

### Autenticación

#### POST /api/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Validaciones:**
- `name`: requerido, string, mínimo 3 caracteres
- `email`: requerido, formato email válido, único
- `password`: requerido, mínimo 8 caracteres

#### POST /api/login
Autentica un usuario y retorna un token JWT.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
}
```

### Tareas (Requieren Autenticación)

**Header requerido en todos los endpoints:**
```
Authorization: Bearer {token}
```

#### GET /api/tasks
Lista todas las tareas del usuario autenticado.

**Query Parameters (opcionales):**
- `status`: filtrar por estado (pending|in_progress|done)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Completar prueba técnica",
      "description": "Desarrollar mini gestor de tareas",
      "status": "in_progress",
      "created_at": "2025-02-06T10:00:00Z",
      "updated_at": "2025-02-06T11:30:00Z"
    }
  ]
}
```

#### POST /api/tasks
Crea una nueva tarea.

**Request Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "pending"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "id": 2,
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "status": "pending",
    "created_at": "2025-02-06T12:00:00Z",
    "updated_at": "2025-02-06T12:00:00Z"
  }
}
```

**Validaciones:**
- `title`: requerido, string, máximo 200 caracteres
- `description`: opcional, string
- `status`: opcional, debe ser uno de: pending|in_progress|done (default: pending)

#### PUT /api/tasks/{id}
Actualiza una tarea existente.

**Request Body:**
```json
{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "status": "done"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": {
    "id": 1,
    "title": "Tarea actualizada",
    "description": "Nueva descripción",
    "status": "done",
    "created_at": "2025-02-06T10:00:00Z",
    "updated_at": "2025-02-06T13:00:00Z"
  }
}
```

## Implementación de Seguridad

### 1. Hash de Contraseñas
```php
// Al registrar
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Al verificar
if (password_verify($inputPassword, $hashedPassword)) {
    // Contraseña correcta
}
```

### 2. Generación de JWT
```php
use Firebase\JWT\JWT;

$payload = [
    'iss' => 'mini-task-manager',
    'sub' => $user->id,
    'iat' => time(),
    'exp' => time() + (60 * 60 * 24) // 24 horas
];

$token = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
```

### 3. Middleware de Autenticación
```php
// Verificar token en cada petición protegida
// Extraer user_id del token
// Validar que el usuario existe y está activo
// Inyectar datos del usuario en el request
```

### 4. Protección CORS
```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

## Configuración del Entorno

### Archivo .env.example
```env
# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=mini_task_manager
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=86400

# App
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd backend
```

### 2. Instalar dependencias
```bash
composer install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Crear base de datos
```bash
mysql -u root -p
CREATE DATABASE mini_task_manager;
exit;
```

### 5. Ejecutar migraciones
```bash
mysql -u root -p mini_task_manager < database/migrations/001_create_users_table.sql
mysql -u root -p mini_task_manager < database/migrations/002_create_tasks_table.sql
```

### 6. Iniciar servidor
```bash
# Usando PHP built-in server
php -S localhost:8000 -t public/

# O usando Phalcon DevTools
phalcon serve --port=8000
```

## Docker (Opcional)

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - .:/var/www/html
    environment:
      - DB_HOST=db
      - DB_DATABASE=mini_task_manager
      - DB_USERNAME=root
      - DB_PASSWORD=secret
    depends_on:
      - db

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: mini_task_manager
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/migrations:/docker-entrypoint-initdb.d

volumes:
  mysql_data:
```

### Levantar con Docker
```bash
docker-compose up -d
docker-compose exec app composer install
```

## Testing

### Ejecutar tests
```bash
# Todos los tests
./vendor/bin/phpunit

# Tests unitarios
./vendor/bin/phpunit --testsuite Unit

# Tests de integración
./vendor/bin/phpunit --testsuite Integration

# Con coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### Ejemplo de test unitario
```php
// tests/Unit/UserValidatorTest.php
public function testValidEmailIsAccepted()
{
    $validator = new UserValidator();
    $result = $validator->validateEmail('test@example.com');
    $this->assertTrue($result);
}
```

## Manejo de Errores

### Respuesta estándar de error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": {
    "field": ["Error específico del campo"]
  }
}
```

### Códigos HTTP
- `200`: Operación exitosa
- `201`: Recurso creado
- `400`: Error de validación
- `401`: No autenticado
- `403`: No autorizado
- `404`: Recurso no encontrado
- `500`: Error del servidor

## Mejores Prácticas Implementadas

1. **Separación de responsabilidades**: Controllers, Services, Models, Validators
2. **Inyección de dependencias**: Para facilitar testing
3. **Validación de datos**: En capa de validadores antes de procesar
4. **Respuestas consistentes**: Formato JSON estandarizado
5. **Logging**: Registrar errores y eventos importantes
6. **Rate limiting**: Protección contra abuso de API
7. **SQL Injection**: Uso de prepared statements
8. **XSS Protection**: Sanitización de inputs

## Extra Points Implementados

- [ ] Tests unitarios con PHPUnit
- [ ] Docker para desarrollo
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Documentación OpenAPI/Swagger
- [ ] CI/CD con GitHub Actions

## Notas Importantes

- Cambiar `JWT_SECRET` en producción
- Usar HTTPS en producción
- Implementar rate limiting en endpoints públicos
- Revisar logs regularmente
- Backup de base de datos periódico
- Implementar soft deletes para datos críticos

## Soporte y Contacto

Para dudas o problemas, crear un issue en el repositorio.
