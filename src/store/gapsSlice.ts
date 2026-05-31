import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { KnowledgeGap } from '@/types/app';

interface GapsState {
  items: KnowledgeGap[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: GapsState = {
  items: [],
  status: 'idle',
  error: null,
};

const gapsSlice = createSlice({
  name: 'gaps',
  initialState,
  reducers: {
    setGaps(state, action: PayloadAction<KnowledgeGap[]>) {
      state.items = action.payload;
      state.status = 'idle';
    },
    addGap(state, action: PayloadAction<KnowledgeGap>) {
      state.items.unshift(action.payload);
    },
    updateGap(state, action: PayloadAction<KnowledgeGap>) {
      const idx = state.items.findIndex((g) => g.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeGap(state, action: PayloadAction<string>) {
      state.items = state.items.filter((g) => g.id !== action.payload);
    },
    setStatus(state, action: PayloadAction<GapsState['status']>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.status = 'error';
    },
  },
});

export const { setGaps, addGap, updateGap, removeGap, setStatus, setError } = gapsSlice.actions;
export default gapsSlice.reducer;
