import { validators, validateTask } from '../src/utils/validation';

describe('Validation Utils', () => {
  describe('validators.email', () => {
    test('returns null for valid email', () => {
      expect(validators.email('test@example.com')).toBeNull();
      expect(validators.email('user.name@domain.org')).toBeNull();
    });

    test('returns error message for empty email', () => {
      expect(validators.email('')).toBe('El email es requerido');
      expect(validators.email(null)).toBe('El email es requerido');
    });

    test('returns error for invalid email format', () => {
      expect(validators.email('invalid')).toBe('Email inválido');
      expect(validators.email('test@')).toBe('Email inválido');
    });
  });

  describe('validators.password', () => {
    test('returns null for valid password', () => {
      expect(validators.password('password123')).toBeNull();
      expect(validators.password('12345678')).toBeNull();
    });

    test('returns error for empty password', () => {
      expect(validators.password('')).toBe('La contraseña es requerida');
    });

    test('returns error for short password', () => {
      expect(validators.password('123')).toBe('Mínimo 8 caracteres');
    });
  });

  describe('validators.required', () => {
    test('returns null for non-empty value', () => {
      expect(validators.required('value', 'Campo')).toBeNull();
    });

    test('returns error for empty value', () => {
      expect(validators.required('', 'Campo')).toBe('Campo es requerido');
      expect(validators.required('  ', 'Campo')).toBe('Campo es requerido');
    });
  });

  describe('validators.minLength', () => {
    test('returns null for value with minimum length', () => {
      expect(validators.minLength('hello', 5, 'Campo')).toBeNull();
    });

    test('returns error for value below minimum length', () => {
      expect(validators.minLength('hi', 5, 'Campo')).toBe('Campo debe tener al menos 5 caracteres');
    });
  });

  describe('validators.maxLength', () => {
    test('returns null for value within max length', () => {
      expect(validators.maxLength('hi', 5, 'Campo')).toBeNull();
    });

    test('returns error for value exceeding max length', () => {
      expect(validators.maxLength('hello', 3, 'Campo')).toBe('Campo no puede exceder 3 caracteres');
    });
  });

  describe('validateTask', () => {
    test('returns empty errors for valid task', () => {
      const task = { title: 'Valid Task', status: 'pending' };
      expect(validateTask(task)).toEqual({});
    });

    test('returns error for empty title', () => {
      const task = { title: '', status: 'pending' };
      const errors = validateTask(task);
      expect(errors.title).toBeDefined();
    });

    test('returns error for title exceeding max length', () => {
      const task = { title: 'a'.repeat(201), status: 'pending' };
      const errors = validateTask(task);
      expect(errors.title).toBeDefined();
    });

    test('returns error for invalid status', () => {
      const task = { title: 'Task', status: 'invalid' };
      const errors = validateTask(task);
      expect(errors.status).toBe('Estado inválido');
    });
  });
});
