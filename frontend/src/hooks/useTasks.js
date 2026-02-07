import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, setFilter } from '../store/slices/taskSlice';

const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, filteredTasks, currentFilter, loading, error, selectedTask } = useSelector((state) => state.tasks);

  const loadTasks = (filter) => {
    dispatch(fetchTasks(filter));
  };

  const addTask = (taskData) => {
    dispatch(createTask(taskData));
  };

  const editTask = (id, taskData) => {
    dispatch(updateTask({ id, taskData }));
  };

  const removeTask = (id) => {
    dispatch(deleteTask(id));
  };

  const changeFilter = (filter) => {
    dispatch(setFilter(filter));
  };

  return {
    tasks,
    filteredTasks,
    currentFilter,
    loading,
    error,
    selectedTask,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    changeFilter
  };
};

export default useTasks;
