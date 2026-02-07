import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await taskApi.getTasks(filter);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener tareas');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskApi.createTask(taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear tarea');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.updateTask(id, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar tarea');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar tarea');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    filteredTasks: [],
    currentFilter: 'all',
    loading: false,
    error: null,
    selectedTask: null
  },
  reducers: {
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
      if (action.payload === 'all') {
        state.filteredTasks = state.tasks;
      } else {
        state.filteredTasks = state.tasks.filter(task => task.status === action.payload);
      }
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        if (state.currentFilter === 'all') {
          state.filteredTasks = action.payload;
        } else {
          state.filteredTasks = action.payload.filter(task => task.status === state.currentFilter);
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        if (state.currentFilter === 'all' || state.currentFilter === action.payload.status) {
          state.filteredTasks.push(action.payload);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        const filteredIndex = state.filteredTasks.findIndex(t => t.id === action.payload.id);
        if (filteredIndex !== -1) {
          if (state.currentFilter === 'all' || state.currentFilter === action.payload.status) {
            state.filteredTasks[filteredIndex] = action.payload;
          } else {
            state.filteredTasks.splice(filteredIndex, 1);
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.filteredTasks = state.filteredTasks.filter(t => t.id !== action.payload);
      });
  }
});

export const { setFilter, selectTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
