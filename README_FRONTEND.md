# Frontend - Mini Gestor de Tareas

## Descripción
Aplicación web construida con React para gestionar tareas personales con autenticación de usuarios y gestión de estado global mediante Redux.

## Requisitos Técnicos

### Stack Tecnológico
- **React**: 18.x
- **Redux Toolkit**: 2.x (gestión de estado)
- **React Router**: 6.x (navegación)
- **Axios**: 1.x (peticiones HTTP)
- **Node.js**: 18.x o superior
- **npm** o **yarn**: Gestor de paquetes

### Dependencias Principales
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "vite": "^5.0.0"
  }
}
```

## Estructura del Proyecto

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── axios.config.js
│   │   ├── authApi.js
│   │   └── taskApi.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Toast.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── tasks/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   └── TaskEditModal.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Navigation.jsx
│   │       └── Footer.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── store/
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── taskSlice.js
│   │   │   └── uiSlice.js
│   │   └── middleware/
│   │       └── authMiddleware.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   └── useForm.js
│   ├── utils/
│   │   ├── validation.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── PrivateRoute.jsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── components/
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   ├── components/
│   ├── pages/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── docker-compose.yml (opcional)
└── README.md
```

## Páginas y Funcionalidades

### 1. Página de Login (/login)

**Componentes:**
- `LoginForm.jsx`

**Funcionalidad:**
- Formulario con email y password
- Validación en tiempo real
- Manejo de errores (credenciales incorrectas)
- Redirección al dashboard tras login exitoso
- Link a página de registro

**Campos del formulario:**
```jsx
{
  email: {
    type: "email",
    required: true,
    validation: "Email válido"
  },
  password: {
    type: "password",
    required: true,
    minLength: 8
  }
}
```

### 2. Página de Registro (/register)

**Componentes:**
- `RegisterForm.jsx`

**Funcionalidad:**
- Formulario con name, email y password
- Validación de formato de email
- Confirmación de contraseña
- Mostrar errores de validación
- Redirección a login tras registro exitoso

**Campos del formulario:**
```jsx
{
  name: {
    type: "text",
    required: true,
    minLength: 3
  },
  email: {
    type: "email",
    required: true,
    validation: "Email válido"
  },
  password: {
    type: "password",
    required: true,
    minLength: 8
  },
  confirmPassword: {
    type: "password",
    required: true,
    mustMatch: "password"
  }
}
```

### 3. Página Dashboard (/dashboard)

**Componentes:**
- `TaskList.jsx`
- `TaskItem.jsx`
- `TaskFilter.jsx`
- `TaskForm.jsx`
- `TaskEditModal.jsx`

**Funcionalidad:**
- Mostrar lista de tareas del usuario
- Filtrar tareas por estado (pending, in_progress, done)
- Botón para crear nueva tarea
- Editar tarea existente (modal)
- Actualizar estado de tarea
- Indicadores visuales de estado
- Contador de tareas por estado

## Redux - Gestión de Estado

### Store Configuration (store.js)
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
```

### Auth Slice (authSlice.js)

**Estado:**
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}
```

**Actions:**
- `login(credentials)` - Async thunk
- `register(userData)` - Async thunk
- `logout()`
- `setCredentials(user, token)`
- `clearError()`

**Ejemplo de implementación:**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  }
});
```

### Task Slice (taskSlice.js)

**Estado:**
```javascript
{
  tasks: [],
  filteredTasks: [],
  currentFilter: 'all',
  loading: false,
  error: null,
  selectedTask: null
}
```

**Actions:**
- `fetchTasks()` - Async thunk
- `createTask(taskData)` - Async thunk
- `updateTask(id, taskData)` - Async thunk
- `deleteTask(id)` - Async thunk
- `setFilter(filter)` - Sincrónico
- `selectTask(task)` - Sincrónico

### UI Slice (uiSlice.js)

**Estado:**
```javascript
{
  toast: {
    show: false,
    message: '',
    type: 'info' // 'success' | 'error' | 'warning' | 'info'
  },
  modal: {
    isOpen: false,
    type: null
  }
}
```

**Actions:**
- `showToast(message, type)`
- `hideToast()`
- `openModal(type)`
- `closeModal()`

## Configuración de API

### axios.config.js
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### authApi.js
```javascript
import api from './axios.config';

export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout')
};
```

### taskApi.js
```javascript
import api from './axios.config';

export const taskApi = {
  getTasks: (filter) => {
    const params = filter && filter !== 'all' ? { status: filter } : {};
    return api.get('/tasks', { params });
  },
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};
```

## Componentes Reutilizables

### Button Component
```jsx
// src/components/common/Button.jsx
const Button = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Loader size="small" /> : children}
    </button>
  );
};
```

### Input Component
```jsx
// src/components/common/Input.jsx
const Input = ({ 
  label, 
  error, 
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={error ? 'input-error' : ''}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

### Toast Component
```jsx
// src/components/common/Toast.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const { show, message, type } = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  if (!show) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={() => dispatch(hideToast())}>×</button>
    </div>
  );
};
```

## Validación de Formularios

### validation.js
```javascript
export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'El email es requerido';
    if (!emailRegex.test(value)) return 'Email inválido';
    return null;
  },

  password: (value) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 8) return 'Mínimo 8 caracteres';
    return null;
  },

  required: (value, fieldName = 'Este campo') => {
    if (!value || value.trim() === '') {
      return `${fieldName} es requerido`;
    }
    return null;
  },

  minLength: (value, min, fieldName = 'Este campo') => {
    if (value && value.length < min) {
      return `${fieldName} debe tener al menos ${min} caracteres`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = 'Este campo') => {
    if (value && value.length > max) {
      return `${fieldName} no puede exceder ${max} caracteres`;
    }
    return null;
  }
};

export const validateTask = (task) => {
  const errors = {};
  
  const titleError = validators.required(task.title, 'El título');
  if (titleError) errors.title = titleError;
  
  const maxLengthError = validators.maxLength(task.title, 200, 'El título');
  if (maxLengthError) errors.title = maxLengthError;
  
  const validStatuses = ['pending', 'in_progress', 'done'];
  if (task.status && !validStatuses.includes(task.status)) {
    errors.status = 'Estado inválido';
  }
  
  return errors;
};
```

## Rutas y Navegación

### AppRoutes.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          } 
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

### PrivateRoute.jsx
```jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

## Diseño Responsivo

### Variables CSS (variables.css)
```css
:root {
  /* Colors */
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --background: #f8fafc;
  --surface: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border: #e2e8f0;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Ejemplo de Estilos Responsivos
```css
/* Mobile First */
.task-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
  .task-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .task-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
  }
}
```

## Configuración del Entorno

### .env.example
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=Mini Task Manager
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_WEBSOCKETS=false
VITE_ENABLE_NOTIFICATIONS=true
```

## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd frontend
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con la URL de tu backend
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext js,jsx",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\""
  }
}
```

## Testing

### Configuración de Jest
```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
```

### Ejemplo de Test
```javascript
// tests/components/TaskItem.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store/store';
import TaskItem from '../../src/components/tasks/TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending'
  };

  it('renders task information correctly', () => {
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} onEdit={onEdit} />
      </Provider>
    );

    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });
});
```

### Ejecutar tests
```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Docker (Opcional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://backend:8000/api
    depends_on:
      - backend
```

### Levantar con Docker
```bash
docker-compose up -d
```

## Mejores Prácticas Implementadas

1. **Componentes funcionales**: Uso de hooks en lugar de clases
2. **Separación de lógica**: Custom hooks para lógica reutilizable
3. **Inmutabilidad**: Redux Toolkit con Immer
4. **Prop Types o TypeScript**: Validación de props
5. **Código limpio**: ESLint + Prettier
6. **Lazy Loading**: Code splitting para rutas
7. **Memoización**: useMemo y useCallback cuando sea necesario
8. **Accesibilidad**: ARIA labels y navegación por teclado
9. **Error Boundaries**: Manejo de errores en componentes
10. **Performance**: React.memo para componentes costosos

## Estructura de Carpetas por Característica (Opcional)

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── store/
│   │   └── pages/
│   └── tasks/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       ├── store/
│       └── pages/
```

## Extra Points Implementados

- [ ] Tests con Jest y React Testing Library
- [ ] Docker para desarrollo
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Tema claro/oscuro
- [ ] Notificaciones push
- [ ] Drag & drop para reordenar tareas

## Optimización de Producción

### Build para producción
```bash
npm run build
```

### Variables de entorno de producción
```env
VITE_API_URL=https://api.your-domain.com/api
VITE_ENABLE_ANALYTICS=true
```

### Despliegue
- Vercel: `vercel --prod`
- Netlify: `netlify deploy --prod`
- GitHub Pages: Configurar en `vite.config.js`

## Accesibilidad (a11y)

- Uso de etiquetas semánticas HTML5
- ARIA labels en botones e iconos
- Navegación por teclado completa
- Contraste de colores WCAG AA
- Formularios con labels asociados
- Mensajes de error descriptivos
- Focus visible en elementos interactivos

## Soporte de Navegadores

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Troubleshooting

### Error: "Cannot connect to backend"
- Verificar que el backend esté corriendo
- Revisar la URL en `.env`
- Verificar CORS en el backend

### Error: "Token expired"
- El token JWT expiró, hacer login nuevamente
- Verificar tiempo de expiración en backend

### Error de CORS
- Configurar headers CORS en el backend
- Verificar que la URL del frontend esté permitida

## Soporte y Contacto

Para dudas o problemas, crear un issue en el repositorio.

## Licencia

MIT
