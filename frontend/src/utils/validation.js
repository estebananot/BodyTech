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
