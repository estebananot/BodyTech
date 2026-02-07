# Mini Gestor de Tareas - Frontend

## Descripción

Aplicación web frontend construida con **React** para gestionar tareas personales con autenticación de usuarios. Permite crear, editar, eliminar y filtrar tareas por estado (pendiente, en progreso, completada).

## Arquitectura

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/                    # Configuración de Axios y servicios API
│   │   ├── axios.config.js     # Instancia de Axios con interceptores
│   │   ├── authApi.js          # Endpoints de autenticación
│   │   └── taskApi.js          # Endpoints de tareas
│   ├── components/             # Componentes reutilizables
│   │   ├── common/             # Componentes UI básicos
│   │   │   ├── Button.jsx      # Botón con variantes
│   │   │   ├── Input.jsx       # Campo de formulario
│   │   │   ├── Loader.jsx      # Spinner de carga
│   │   │   ├── Modal.jsx       # Ventana modal
│   │   │   └── Toast.jsx       # Notificaciones
│   │   ├── auth/               # Componentes de autenticación
│   │   │   ├── LoginForm.jsx   # Formulario de login
│   │   │   └── RegisterForm.jsx# Formulario de registro
│   │   ├── tasks/              # Componentes de tareas
│   │   │   ├── TaskForm.jsx    # Formulario crear/editar
│   │   │   ├── TaskItem.jsx    # Tarjeta de tarea individual
│   │   │   ├── TaskList.jsx    # Lista de tareas
│   │   │   ├── TaskFilter.jsx  # Filtros por estado
│   │   │   └── TaskEditModal.jsx
│   │   └── layout/             # Componentes de estructura
│   │       ├── Header.jsx      # Barra de navegación
│   │       └── Footer.jsx       # Pie de página
│   ├── pages/                  # Páginas principales
│   │   ├── LoginPage.jsx       # Página de login
│   │   ├── RegisterPage.jsx    # Página de registro
│   │   ├── DashboardPage.jsx   # Dashboard principal
│   │   └── NotFoundPage.jsx    # Página 404
│   ├── store/                  # Estado global (Redux)
│   │   ├── store.js            # Configuración del store
│   │   └── slices/
│   │       ├── authSlice.js    # Estado de autenticación
│   │       ├── taskSlice.js    # Estado de tareas
│   │       └── uiSlice.js      # Estado de UI (toast, modal)
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js          # Hook de autenticación
│   │   ├── useTasks.js         # Hook de tareas
│   │   └── useForm.js          # Hook de formularios
│   ├── utils/                 # Utilidades
│   │   ├── validation.js       # Validadores de formularios
│   │   ├── constants.js        # Constantes globales
│   │   └── helpers.js          # Funciones helper
│   ├── routes/                 # Configuración de rutas
│   │   ├── AppRoutes.jsx       # Rutas principales
│   │   └── PrivateRoute.jsx    # Ruta protegida
│   ├── App.jsx                 # Componente raíz
│   ├── main.jsx                # Punto de entrada
│   └── index.css               # Estilos globales (Tailwind)
├── .env                        # Variables de entorno
├── tailwind.config.js          # Configuración Tailwind CSS
├── postcss.config.js           # Configuración PostCSS
├── vite.config.js              # Configuración Vite
└── package.json
```

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Framework UI |
| React Router | 6.x | Navegación |
| Redux Toolkit | 2.x | Gestión de estado |
| Axios | 1.x | Cliente HTTP |
| Tailwind CSS | 4.x | Estilos CSS |
| Vite | 5.x | Build tool |

## Características

### Autenticación
- Registro de usuarios
- Login con JWT
- Persistencia de sesión (localStorage)
- Rutas protegidas

### Gestión de Tareas
- Crear tareas con título, descripción y estado
- Editar tareas existentes
- Eliminar tareas
- Cambiar estado de tareas
- Filtrar por estado (todas, pendiente, en progreso, completada)
- Contadores por estado

### UI/UX
- Diseño responsive (mobile-first)
- Notificaciones Toast
- Modal para crear/editar tareas
- Estados de carga
- Manejo de errores

## Requisitos

- Node.js 18.x o superior
- npm o yarn
- Backend ejecutándose en `http://localhost:8000`

## Instalación

```bash
# 1. Navegar al directorio frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# El archivo .env ya está configurado por defecto

# 4. Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Mini Task Manager
VITE_APP_VERSION=1.0.0
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| VITE_API_URL | URL del backend | `http://localhost:8000/api` |
| VITE_APP_NAME | Nombre de la aplicación | `Mini Task Manager` |
| VITE_APP_VERSION | Versión | `1.0.0` |

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Build para producción
npm run preview      # Preview del build

# Linting
npm run lint         # Verificar errores de linting
```

## Configuración del Backend

El frontend está configurado para conectarse a un backend en `http://localhost:8000/api`.

### Endpoints utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/login` | Autenticación |
| POST | `/api/register` | Registro |
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/{id}` | Actualizar tarea |
| DELETE | `/api/tasks/{id}` | Eliminar tarea |

## API de Autenticación

### Login
```javascript
// Request
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (éxito)
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Usuario",
      "email": "user@example.com"
    }
  }
}
```

### Registro
```javascript
// Request
POST /api/register
{
  "name": "Usuario",
  "email": "user@example.com",
  "password": "password123"
}

// Response (éxito)
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "name": "Usuario",
    "email": "user@example.com"
  }
}
```

## API de Tareas

### Listar tareas
```javascript
GET /api/tasks?status=pending

// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Tarea 1",
      "description": "Descripción",
      "status": "pending",
      "created_at": "2026-02-06 17:27:05",
      "updated_at": "2026-02-06 17:27:05"
    }
  ]
}
```

### Crear tarea
```javascript
POST /api/tasks
{
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "status": "pending"
}
```

### Actualizar tarea
```javascript
PUT /api/tasks/1
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "status": "done"
}
```

### Eliminar tarea
```javascript
DELETE /api/tasks/1
```

## Estados de Tarea

| Estado | Descripción | Color |
|--------|-------------|-------|
| `pending` | Pendiente | Amarillo |
| `in_progress` | En Progreso | Azul |
| `done` | Completada | Verde |

## Deployment

### Build para producción
```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

### Variables de producción
```env
VITE_API_URL=https://api.tu-dominio.com/api
```

### Servidor de producción
```bash
# Usando Vite preview
npm run preview

# O sirviendo la carpeta dist/ con nginx/Apache
```

## Licencia

MIT

## Autor

Desarrollado como prueba técnica.
