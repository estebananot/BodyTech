import { useDispatch } from 'react-redux';
import { updateTask, deleteTask, selectTask } from '../../store/slices/taskSlice';
import { showToast, openModal } from '../../store/slices/uiSlice';

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const statusLabels = {
    pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
    in_progress: { label: 'En Progreso', class: 'bg-blue-100 text-blue-800' },
    done: { label: 'Completada', class: 'bg-green-100 text-green-800' }
  };

  const handleStatusChange = (e) => {
    dispatch(updateTask({ id: task.id, taskData: { status: e.target.value } })).then((result) => {
      if (updateTask.fulfilled.match(result)) {
        dispatch(showToast({ message: 'Tarea actualizada', type: 'success' }));
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      dispatch(deleteTask(task.id)).then((result) => {
        if (deleteTask.fulfilled.match(result)) {
          dispatch(showToast({ message: 'Tarea eliminada', type: 'success' }));
        }
      });
    }
  };

  const handleEdit = () => {
    dispatch(selectTask(task));
    dispatch(openModal('edit'));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 break-words">{task.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusLabels[task.status].class}`}>
            {statusLabels[task.status].label}
          </span>
        </div>
      </div>
      {task.description && (
        <p className="text-gray-600 mb-3 text-sm break-words">{task.description}</p>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusLabels[task.status].class}`}>
          {statusLabels[task.status].label}
        </span>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors p-1"
            title="Editar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 transition-colors p-1"
            title="Eliminar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
