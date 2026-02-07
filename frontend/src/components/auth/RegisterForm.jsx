import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Mínimo 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Debe tener al menos una mayúscula';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Debe tener al menos una minúscula';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Debe tener al menos un número';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Debe tener al menos un caracter especial';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      dispatch(register(userData)).then((result) => {
        if (register.fulfilled.match(result)) {
          dispatch(showToast({ message: 'Usuario registrado exitosamente', type: 'success' }));
          navigate('/login');
        }
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Tu nombre"
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="tu@email.com"
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Mínimo 8 caracteres con mayúsculas, números y especiales"
          required
        />
        <Input
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Crear Cuenta
        </Button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
