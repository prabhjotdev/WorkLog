import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Sprint, SprintVelocityRow } from '@/types/app';

interface SprintsState {
  items: Sprint[];
  velocity: SprintVelocityRow[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  activeSprintId: string | null;
}

const initialState: SprintsState = {
  items: [],
  velocity: [],
  status: 'idle',
  error: null,
  activeSprintId: null,
};

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    setSprints(state, action: PayloadAction<Sprint[]>) {
      state.items = action.payload;
      state.status = 'idle';
    },
    addSprint(state, action: PayloadAction<Sprint>) {
      state.items.unshift(action.payload);
    },
    updateSprint(state, action: PayloadAction<Sprint>) {
      const idx = state.items.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeSprint(state, action: PayloadAction<string>) {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
    setVelocity(state, action: PayloadAction<SprintVelocityRow[]>) {
      state.velocity = action.payload;
    },
    setActiveSprint(state, action: PayloadAction<string | null>) {
      state.activeSprintId = action.payload;
    },
    setStatus(state, action: PayloadAction<SprintsState['status']>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.status = 'error';
    },
  },
});

export const {
  setSprints,
  addSprint,
  updateSprint,
  removeSprint,
  setVelocity,
  setActiveSprint,
  setStatus,
  setError,
} = sprintsSlice.actions;
export default sprintsSlice.reducer;
