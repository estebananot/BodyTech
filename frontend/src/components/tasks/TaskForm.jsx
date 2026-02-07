import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../store/slices/taskSlice';
import { showToast } from '../../store/slices/uiSlice';
import Button from '../common/Button';

const TaskForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  }, [formData.title]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Máximo 200 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createTask(formData)).then((result) => {
        if (createTask.fulfilled.match(result)) {
          dispatch(showToast({ message: 'Tarea creada exitosamente', type: 'success' }));
          onClose();
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="¿Qué necesitas hacer?"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.title && <span className="text-sm text-red-500 mt-1">{errors.title}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Agrega una descripción opcional..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="done">Completada</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          Crear Tarea
        </Button>
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
