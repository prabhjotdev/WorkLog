import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TaskFilters {
  status: string[];
  priority: string[];
  tags: string[];
  sprintId: string | null;
  search: string;
}

interface UiState {
  taskModalOpen: boolean;
  sprintModalOpen: boolean;
  gapModalOpen: boolean;
  editingTaskId: string | null;
  editingSprintId: string | null;
  editingGapId: string | null;
  taskFilters: TaskFilters;
  reportRange: { from: string; to: string } | null;
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  taskModalOpen: false,
  sprintModalOpen: false,
  gapModalOpen: false,
  editingTaskId: null,
  editingSprintId: null,
  editingGapId: null,
  taskFilters: {
    status: [],
    priority: [],
    tags: [],
    sprintId: null,
    search: '',
  },
  reportRange: null,
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTaskModal(state, action: PayloadAction<string | null>) {
      state.taskModalOpen = true;
      state.editingTaskId = action.payload;
    },
    closeTaskModal(state) {
      state.taskModalOpen = false;
      state.editingTaskId = null;
    },
    openSprintModal(state, action: PayloadAction<string | null>) {
      state.sprintModalOpen = true;
      state.editingSprintId = action.payload;
    },
    closeSprintModal(state) {
      state.sprintModalOpen = false;
      state.editingSprintId = null;
    },
    openGapModal(state, action: PayloadAction<string | null>) {
      state.gapModalOpen = true;
      state.editingGapId = action.payload;
    },
    closeGapModal(state) {
      state.gapModalOpen = false;
      state.editingGapId = null;
    },
    setTaskFilters(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.taskFilters = { ...state.taskFilters, ...action.payload };
    },
    clearTaskFilters(state) {
      state.taskFilters = initialState.taskFilters;
    },
    setReportRange(state, action: PayloadAction<{ from: string; to: string } | null>) {
      state.reportRange = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const {
  openTaskModal,
  closeTaskModal,
  openSprintModal,
  closeSprintModal,
  openGapModal,
  closeGapModal,
  setTaskFilters,
  clearTaskFilters,
  setReportRange,
  toggleSidebar,
} = uiSlice.actions;
export default uiSlice.reducer;
