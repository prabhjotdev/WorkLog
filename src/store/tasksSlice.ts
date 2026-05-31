import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '@/types/app';

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  activeTaskId: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
  activeTaskId: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
      state.status = 'idle';
    },
    addTask(state, action: PayloadAction<Task>) {
      state.items.unshift(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setActiveTask(state, action: PayloadAction<string | null>) {
      state.activeTaskId = action.payload;
    },
    setStatus(state, action: PayloadAction<TasksState['status']>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.status = 'error';
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setActiveTask,
  setStatus,
  setError,
} = tasksSlice.actions;
export default tasksSlice.reducer;
