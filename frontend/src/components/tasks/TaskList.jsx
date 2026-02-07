import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchTasks, setFilter } from '../../store/slices/taskSlice';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import { showToast } from '../../store/slices/uiSlice';
import Loader from '../common/Loader';

const TaskList = () => {
  const dispatch = useDispatch();
  const { filteredTasks, currentFilter, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks(currentFilter)).then((result) => {
      if (fetchTasks.rejected.match(result)) {
        dispatch(showToast({ message: error || 'Error al cargar tareas', type: 'error' }));
      }
    });
  }, [dispatch, currentFilter, error]);

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  const counts = useSelector((state) => ({
    all: state.tasks.tasks.length,
    pending: state.tasks.tasks.filter(t => t.status === 'pending').length,
    in_progress: state.tasks.tasks.filter(t => t.status === 'in_progress').length,
    done: state.tasks.tasks.filter(t => t.status === 'done').length
  }));

  if (loading && filteredTasks.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <TaskFilter currentFilter={currentFilter} onFilterChange={handleFilterChange} />
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            {counts.pending} Pend.
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {counts.in_progress} Prog.
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
            {counts.done} Done
          </span>
        </div>
      </div>
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm sm:text-base">No hay tareas para mostrar</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
