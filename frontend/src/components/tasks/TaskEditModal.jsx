import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, selectTask } from '../../store/slices/taskSlice';
import { showToast, closeModal } from '../../store/slices/uiSlice';
import Button from '../common/Button';

const TaskEditModal = () => {
  const dispatch = useDispatch();
  const { modal, selectedTask } = useSelector((state) => ({
    modal: state.ui.modal,
    selectedTask: state.tasks.selectedTask
  }));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        status: selectedTask.status || 'pending'
      });
    }
  }, [selectedTask]);

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
    if (validateForm() && selectedTask) {
      dispatch(updateTask({ id: selectedTask.id, taskData: formData })).then((result) => {
        if (updateTask.fulfilled.match(result)) {
          dispatch(showToast({ message: 'Tarea actualizada', type: 'success' }));
          dispatch(closeModal());
          dispatch(selectTask(null));
        }
      });
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(selectTask(null));
  };

  if (!modal.isOpen || modal.type !== 'edit') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Editar Tarea</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="done">Completada</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Guardar Cambios
              </Button>
              <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
