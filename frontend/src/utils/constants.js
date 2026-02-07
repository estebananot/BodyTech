export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Mini Task Manager';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

export const TASK_STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  done: 'Completada'
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
