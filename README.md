# Mini Gestor de Tareas

Aplicación web completa para gestión de tareas con autenticación JWT, CRUD de tareas y notificaciones en tiempo real mediante WebSocket.

## 🚀 Ejecución Rápida

### (Docker Compose)

```bash
docker-compose up -d
```

Espera unos segundos a que todos los servicios inicien y luego accede a:

- **Frontend:** http://localhost:5173
- **API:** http://localhost:8000

## 🌐 Servicios

| Servicio      | URL                     | Puerto | Descripción                        |
|---------------|-------------------------|--------|-------------------------------------|
| Frontend      | http://localhost:5173   | 5173   | React + Vite + Tailwind CSS         |
| Backend API   | http://localhost:8000   | 8000   | PHP 8.2 + Slim Framework            |
| WebSocket     | ws://localhost:8080     | 8080   | Notificaciones en tiempo real       |
| PostgreSQL    | localhost:5432          | 5432   | Base de datos relacional            |

## 📋 Requisitos

- Docker
- Docker Compose
- Git

## 🐘 Base de Datos

| Configuración | Valor                    |
|---------------|--------------------------|
| Motor         | PostgreSQL 15            |
| Database      | mini_task_manager        |
| Usuario       | root                     |
| Password      | secret                   |
| Puerto        | 5432                     |
| Host          | postgres (interno Docker)|

## 🔐 Variables de Entorno

### Backend (backend/.env)

```env
# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=mini_task_manager
DB_USERNAME=root
DB_PASSWORD=secret

# JWT
JWT_SECRET=hv2u0...
JWT_EXPIRATION=86400
```

### Frontend (frontend/.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8080
VITE_APP_NAME=Mini Task Manager
VITE_APP_VERSION=1.0.0
```

## 📁 Estructura del Proyecto

```
Prueba_Tecnica/
├── docker-compose.yml          # Orquestación principal de servicios
├── README.md                   # Este archivo
│
├── backend/                    # API REST + WebSocket
│   ├── Dockerfile              # Imagen Docker del backend
│   ├── Dockerfile.websocket    # Imagen Docker del WebSocket
│   ├── composer.json           # Dependencias PHP
│   ├── .env                    # Variables de entorno
│   ├── .dockerignore           # Archivos excluidos en build
│   │
│   ├── app/                    # Código fuente del backend
│   │   ├── Controllers/       # Controladores (Auth, Tasks)
│   │   ├── Database.php       # Conexión PostgreSQL
│   │   ├── Middleware.php     # Autenticación JWT
│   │   └── Models/            # Modelos de datos
│   │
│   ├── database/
│   │   ├── init.sql           # Esquema inicial PostgreSQL
│   │   └── Setup.php          # Script de configuración
│   │
│   ├── public/                # Punto de entrada API
│   │   └── index.php
│   │
│   ├── tests/                 # Tests PHPUnit
│   │   └── Unit/
│   │
│   └── websocket/             # Servidor WebSocket
│       ├── server.php         # Servidor Ratchet
│       └── TaskNotificationServer.php
│
└── frontend/                  # Aplicación React
    ├── Dockerfile             # Imagen Docker del frontend
    ├── package.json           # Dependencias Node.js
    ├── vite.config.js         # Configuración Vite
    ├── .env                   # Variables entorno
    ├── .dockerignore
    │
    ├── src/
    │   ├── components/        # Componentes React
    │   ├── pages/             # Páginas (Login, Register, Dashboard)
    │   ├── services/          # API y WebSocket
    │   ├── store/             # Redux Toolkit
    │   ├── App.jsx            # Componente principal
    │   └── main.jsx           # Entry point
    │
    ├── public/                # Archivos estáticos
    │   └── vite.svg
    │
    ├── tests/                 # Tests Jest
    │   └── *.test.jsx
    │
    └── dist/                  # Build de producción
```

## 🔧 Comandos Útiles

```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f websocket
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (borra PostgreSQL)
docker-compose down -v

# Reconstruir imágenes desde cero
docker-compose build --no-cache
docker-compose up -d --build

# Ver estado de contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart websocket
```

## 🧪 Testing

```bash
# Tests del backend (PHPUnit)
docker-compose exec backend php vendor/bin/phpunit

# Tests del frontend (Jest)
docker-compose exec frontend npm test

# Coverage del frontend
docker-compose exec frontend npm run test:coverage
```

## 🔐 Endpoints API

### Autenticación

| Método | Endpoint        | Descripción           | Body                                      |
|--------|-----------------|-----------------------|-------------------------------------------|
| POST   | `/api/register` | Registro de usuario   | `{"name":"John","email":"john@test.com","password":"password123"}` |
| POST   | `/api/login`    | Login                 | `{"email":"john@test.com","password":"password123"}`           |
| GET    | `/api/me`       | Datos del usuario     | Authorization: Bearer {token}             |

### Tareas (requieren JWT)

| Método   | Endpoint              | Descripción           | Body                                              |
|----------|-----------------------|-----------------------|---------------------------------------------------|
| GET      | `/api/tasks`          | Listar tareas         | Authorization: Bearer {token}                    |
| POST     | `/api/tasks`          | Crear tarea           | `{"title":"Mi tarea","description":"Descripción"}` |
| PUT      | `/api/tasks/{id}`     | Actualizar tarea     | `{"title":"Nuevo título","completed":true}`       |
| DELETE   | `/api/tasks/{id}`     | Eliminar tarea       | Authorization: Bearer {token}                    |

### Ejemplo de Uso

```bash
# Registrar usuario
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Obtener token y usarlo para crear tarea
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Mi primera tarea","description":"Esta es una tarea"}'
```

## 🔌 WebSocket

El servidor WebSocket escucha en `ws://localhost:8080` y notifica en tiempo real cuando:

- Se crea una nueva tarea
- Se actualiza una tarea
- Se elimina una tarea

### Eventos WebSocket

| Evento          | Descripción                          | Payload                          |
|-----------------|--------------------------------------|----------------------------------|
| `task:created`  | Nueva tarea creada                   | `{"type":"task:created","task":{...}}` |
| `task:updated`  | Tarea actualizada                    | `{"type":"task:updated","task":{...}}` |
| `task:deleted`  | Tarea eliminada                      | `{"type":"task:deleted","taskId":1}`   |

## 🏗️ Desarrollo Local (sin Docker)

### Backend

```bash
cd backend
composer install

# Configurar .env para PostgreSQL local
# Crear database 'mini_task_manager' en PostgreSQL
php database/Setup.php

# Iniciar servidor desarrollo
php -S localhost:8000 -t public/
```

### WebSocket

```bash
cd backend
php websocket/server.php
```

### Frontend

```bash
cd frontend
npm install

# Desarrollo con hot-reload
npm run dev

# Build producción
npm run build

# Preview producción
npm run preview
```

## 🛠️ Stack Tecnológico

### Backend
- **PHP 8.2** - Lenguaje de programación
- **Slim 4** - Framework PHP
- **Firebase/JWT** - Autenticación JSON Web Tokens
- **Ratchet** - WebSocket server
- **PostgreSQL** - Base de datos relacional

### Frontend
- **React 19** - Biblioteca UI
- **Vite 7** - Build tool y servidor desarrollo
- **Tailwind CSS 4** - Framework CSS
- **Redux Toolkit** - Gestión de estado
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Jest** - Testing

## 📄 Licencia

MIT
