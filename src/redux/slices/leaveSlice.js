import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  applications: [],
  balances: [],
  types: [],
  policies: [],
  currentApplication: null,
  pendingCount: 0,
  filters: {
    status: 'all',
    type: '',
    dateRange: [],
  },
};

const slice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET APPLICATIONS SUCCESS
    getApplicationsSuccess(state, action) {
      state.isLoading = false;
      state.applications = action.payload.applications;
      state.pendingCount = action.payload.pendingCount || 0;
    },

    // GET APPLICATION SUCCESS
    getApplicationSuccess(state, action) {
      state.isLoading = false;
      state.currentApplication = action.payload;
    },

    // CREATE APPLICATION SUCCESS
    createApplicationSuccess(state, action) {
      state.isLoading = false;
      state.applications.unshift(action.payload);
      if (action.payload.status === 'pending') {
        state.pendingCount += 1;
      }
    },

    // UPDATE APPLICATION SUCCESS
    updateApplicationSuccess(state, action) {
      state.isLoading = false;
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        const oldStatus = state.applications[index].status;
        state.applications[index] = action.payload;
        
        // Update pending count
        if (oldStatus === 'pending' && action.payload.status !== 'pending') {
          state.pendingCount = Math.max(0, state.pendingCount - 1);
        } else if (oldStatus !== 'pending' && action.payload.status === 'pending') {
          state.pendingCount += 1;
        }
      }
    },

    // APPROVE APPLICATION SUCCESS
    approveApplicationSuccess(state, action) {
      state.isLoading = false;
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...action.payload, status: 'approved' };
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      }
    },

    // REJECT APPLICATION SUCCESS
    rejectApplicationSuccess(state, action) {
      state.isLoading = false;
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...action.payload, status: 'rejected' };
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      }
    },

    // GET BALANCES SUCCESS
    getBalancesSuccess(state, action) {
      state.isLoading = false;
      state.balances = action.payload;
    },

    // GET TYPES SUCCESS
    getTypesSuccess(state, action) {
      state.isLoading = false;
      state.types = action.payload;
    },

    // GET POLICIES SUCCESS
    getPoliciesSuccess(state, action) {
      state.isLoading = false;
      state.policies = action.payload;
    },

    // SET FILTERS
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // CLEAR CURRENT APPLICATION
    clearCurrentApplication(state) {
      state.currentApplication = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getApplicationsSuccess,
  getApplicationSuccess,
  createApplicationSuccess,
  updateApplicationSuccess,
  approveApplicationSuccess,
  rejectApplicationSuccess,
  getBalancesSuccess,
  getTypesSuccess,
  getPoliciesSuccess,
  setFilters,
  clearCurrentApplication,
} = slice.actions;

// Selectors
export const selectLeave = (state) => state.leave;
export const selectApplications = (state) => state.leave.applications;
export const selectCurrentApplication = (state) => state.leave.currentApplication;
export const selectBalances = (state) => state.leave.balances;
export const selectLeaveTypes = (state) => state.leave.types;
export const selectLeavePolicies = (state) => state.leave.policies;
export const selectPendingCount = (state) => state.leave.pendingCount;
export const selectLeaveFilters = (state) => state.leave.filters;

